/* eslint-disable @typescript-eslint/no-explicit-any -- in-memory drizzle/db mock store deliberately uses loose typing */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted shared state (in-memory fake DB) ──
const h = vi.hoisted(() => ({
  rows: [] as any[],
  accounts: [] as any[],
  idCounter: 1,
}));

// Predicate descriptors produced by the mocked drizzle-orm helpers.
function matchPred(row: any, pred: any): boolean {
  if (!pred) return true;
  if (pred.op === "and") return pred.preds.every((p: any) => matchPred(row, p));
  if (pred.op === "eq") return row[pred.col] === pred.val;
  return true;
}

vi.mock("drizzle-orm", () => ({
  eq: (col: string, val: unknown) => ({ op: "eq", col, val }),
  and: (...preds: unknown[]) => ({ op: "and", preds }),
}));

vi.mock("@/db/schema", () => ({
  projects: { __table: "projects", id: "id", profileId: "profileId", repoId: "repoId" },
}));

vi.mock("@/db/auth-schema", () => ({
  account: { __table: "account", providerId: "providerId", userId: "userId" },
}));

vi.mock("@/db", () => {
  const dataFor = (table: any) =>
    table?.__table === "account" ? h.accounts : h.rows;
  const db = {
    select: () => ({
      from: (table: any) => ({
        where: (pred: any) => ({
          limit: () =>
            Promise.resolve(dataFor(table).filter((r) => matchPred(r, pred))),
        }),
      }),
    }),
    update: (table: any) => ({
      set: (vals: any) => ({
        where: (pred: any) => ({
          returning: () => {
            const matched = dataFor(table).filter((r) => matchPred(r, pred));
            matched.forEach((r) => Object.assign(r, vals));
            return Promise.resolve(matched.map((r) => ({ ...r })));
          },
        }),
      }),
    }),
    insert: (table: any) => ({
      values: (vals: any) => ({
        returning: () => {
          const row = { id: `proj-${h.idCounter++}`, ...vals };
          dataFor(table).push(row);
          return Promise.resolve([{ ...row }]);
        },
      }),
    }),
  };
  return { db };
});

vi.mock("@/lib/auth-guard", () => ({
  getAuthSession: vi.fn(async () => ({ userId: "user-1", profileId: "profile-1" })),
  getAuthUser: vi.fn(async () => ({ userId: "user-1" })),
  handleApiError: (err: any) =>
    ({ status: 500, _error: err?.message }) as any,
}));

import {
  getGithubToken,
  fetchUserRepos,
  repoToProjectValues,
} from "@/lib/github";
import { POST as importPost } from "@/app/api/github/import/route";
import { POST as refreshPost } from "@/app/api/github/refresh/[projectId]/route";

// A raw GitHub API repo object.
function ghRepo(over: Partial<Record<string, unknown>> = {}) {
  return {
    id: 123,
    name: "my-repo",
    full_name: "user/my-repo",
    description: "a repo",
    html_url: "https://github.com/user/my-repo",
    stargazers_count: 5,
    language: "TypeScript",
    ...over,
  };
}

function mockFetchOk(payload: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, status: 200, json: async () => payload }))
  );
}

beforeEach(() => {
  h.rows = [];
  h.accounts = [{ providerId: "github", userId: "user-1", accessToken: "tok-1" }];
  h.idCounter = 1;
  vi.unstubAllGlobals();
});

describe("repoToProjectValues", () => {
  it("maps github fields into a projects insert object", () => {
    const repo = {
      repoId: "123",
      name: "my-repo",
      description: "a repo",
      htmlUrl: "https://github.com/user/my-repo",
      stars: 7,
      language: "Go",
    };
    const v = repoToProjectValues(repo, "profile-1");
    expect(v.profileId).toBe("profile-1");
    expect(v.title).toBe("my-repo");
    expect(v.repoUrl).toBe("https://github.com/user/my-repo");
    expect(v.repoId).toBe("123");
    expect(typeof v.repoId).toBe("string");
    expect(v.stars).toBe(7);
    expect(v.language).toBe("Go");
    expect(v.stack).toEqual(["Go"]);
    expect(v.githubPinned).toBe(true);
    expect(v.lastSyncedAt).toBeInstanceOf(Date);
  });

  it("uses an empty stack when language is null", () => {
    const v = repoToProjectValues(
      {
        repoId: "1",
        name: "n",
        description: null,
        htmlUrl: "u",
        stars: null,
        language: null,
      },
      "p"
    );
    expect(v.stack).toEqual([]);
    expect(v.description).toBeNull();
    expect(v.stars).toBeNull();
  });
});

describe("getGithubToken", () => {
  it("returns the stored github access token", async () => {
    await expect(getGithubToken("user-1")).resolves.toBe("tok-1");
  });

  it("returns null when no github account is linked", async () => {
    h.accounts = [];
    await expect(getGithubToken("user-1")).resolves.toBeNull();
  });
});

describe("fetchUserRepos", () => {
  it("maps the raw github response and throws on non-ok", async () => {
    mockFetchOk([ghRepo({ id: 99, stargazers_count: 12 })]);
    const repos = await fetchUserRepos("tok");
    expect(repos[0]).toMatchObject({
      repoId: "99",
      htmlUrl: "https://github.com/user/my-repo",
      stars: 12,
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) }))
    );
    await expect(fetchUserRepos("tok")).rejects.toThrow();
  });
});

describe("import route idempotency", () => {
  it("inserts on first import and updates (no duplicate) on re-import", async () => {
    mockFetchOk([ghRepo({ id: 123, stargazers_count: 5, language: "TypeScript" })]);
    const req1: any = { json: async () => ({ repoIds: ["123"] }) };

    const res1 = await importPost(req1);
    const body1 = await res1.json();
    expect(body1.imported).toBe(1);
    expect(h.rows).toHaveLength(1);
    expect(h.rows[0].title).toBe("my-repo");

    // Simulate a user editing the imported project's title.
    h.rows[0].title = "User Edited Title";

    // Re-import the same repo with fresh metadata.
    mockFetchOk([ghRepo({ id: 123, stargazers_count: 42, language: "Rust" })]);
    const req2: any = { json: async () => ({ repoIds: ["123"] }) };
    const res2 = await importPost(req2);
    const body2 = await res2.json();

    expect(body2.imported).toBe(1);
    expect(h.rows).toHaveLength(1); // no duplicate
    expect(h.rows[0].title).toBe("User Edited Title"); // preserved
    expect(h.rows[0].stars).toBe(42); // metadata refreshed
    expect(h.rows[0].language).toBe("Rust");
  });

  it("rejects an empty/invalid repoIds body with 400", async () => {
    const res = await importPost({ json: async () => ({ repoIds: [] }) } as any);
    expect(res.status).toBe(400);
  });
});

describe("refresh route preserves user edits", () => {
  it("updates stars/language/lastSyncedAt but not title/description/bodyMarkdown", async () => {
    const old = new Date("2020-01-01T00:00:00Z");
    h.rows = [
      {
        id: "p1",
        profileId: "profile-1",
        repoId: "123",
        title: "My Custom Title",
        description: "my custom description",
        bodyMarkdown: "# custom body",
        role: "Lead",
        stars: 1,
        language: "JavaScript",
        lastSyncedAt: old,
      },
    ];

    mockFetchOk([ghRepo({ id: 123, stargazers_count: 99, language: "TypeScript" })]);

    const res = await refreshPost({} as any, {
      params: Promise.resolve({ projectId: "p1" }),
    });
    const body = await res.json();

    expect(body.project.stars).toBe(99);
    expect(body.project.language).toBe("TypeScript");
    expect(new Date(body.project.lastSyncedAt).getTime()).not.toBe(old.getTime());
    // User-editable fields untouched
    expect(body.project.title).toBe("My Custom Title");
    expect(body.project.description).toBe("my custom description");
    expect(body.project.bodyMarkdown).toBe("# custom body");
    expect(body.project.role).toBe("Lead");
    expect(h.rows).toHaveLength(1);
  });

  it("returns 404 when the project is not owned/found", async () => {
    h.rows = [];
    const res = await refreshPost({} as any, {
      params: Promise.resolve({ projectId: "missing" }),
    });
    expect(res.status).toBe(404);
  });
});
