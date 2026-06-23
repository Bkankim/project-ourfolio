import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks (hoisted so the vi.mock factories can reference them) ──
const h = vi.hoisted(() => ({
  getSession: vi.fn(),
  profileRows: [] as unknown[],
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: h.getSession } },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: vi.fn() })),
}));

// Controllable profile query result. db.select().from().where().limit() -> Promise<rows>
vi.mock("@/db", () => {
  const limit = vi.fn(() => Promise.resolve(h.profileRows));
  const where = vi.fn(() => ({ limit }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  return { db: { select } };
});

vi.mock("@/db/schema", () => ({
  profiles: { id: "id", userId: "userId" },
}));

import {
  getAuthUser,
  getAuthSession,
  handleApiError,
  AuthError,
} from "@/lib/auth-guard";

describe("getAuthUser (unauthenticated -> blocked)", () => {
  beforeEach(() => {
    h.getSession.mockReset();
    h.profileRows = [];
  });

  it("throws AuthError(401) when getSession returns null", async () => {
    h.getSession.mockResolvedValue(null);
    await expect(getAuthUser()).rejects.toBeInstanceOf(AuthError);
    await expect(getAuthUser()).rejects.toMatchObject({ status: 401 });
  });

  it("resolves to the session user when a session is present", async () => {
    h.getSession.mockResolvedValue({ user: { id: "user-123" } });
    const result = await getAuthUser();
    expect(result.userId).toBe("user-123");
    expect(result.session.user.id).toBe("user-123");
  });
});

describe("getAuthSession", () => {
  beforeEach(() => {
    h.getSession.mockReset();
    h.profileRows = [];
  });

  it("rejects with AuthError(401) when unauthenticated", async () => {
    h.getSession.mockResolvedValue(null);
    await expect(getAuthSession()).rejects.toMatchObject({ status: 401 });
  });

  it("resolves to user/profileId when session + profile exist", async () => {
    h.getSession.mockResolvedValue({ user: { id: "user-123" } });
    h.profileRows = [{ id: "profile-abc", userId: "user-123" }];
    const result = await getAuthSession();
    expect(result.userId).toBe("user-123");
    expect(result.profileId).toBe("profile-abc");
  });

  it("rejects with AuthError(404) when profile is missing", async () => {
    h.getSession.mockResolvedValue({ user: { id: "user-123" } });
    h.profileRows = [];
    await expect(getAuthSession()).rejects.toMatchObject({ status: 404 });
  });
});

describe("handleApiError", () => {
  it("maps the unauthorized AuthError to a 401 NextResponse", () => {
    const res = handleApiError(new AuthError("Unauthorized", 401));
    expect(res.status).toBe(401);
  });

  it("maps an unknown error to a 500 NextResponse", () => {
    const res = handleApiError(new Error("boom"));
    expect(res.status).toBe(500);
  });
});
