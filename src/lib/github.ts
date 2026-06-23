import { db } from "@/db";
import { account } from "@/db/auth-schema";
import { and, eq } from "drizzle-orm";

export interface GithubRepo {
  repoId: string;
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number | null;
  language: string | null;
}

/**
 * Look up the stored GitHub OAuth access token for a user.
 * Returns the token string, or null if no linked GitHub account exists.
 */
export async function getGithubToken(userId: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(account)
    .where(and(eq(account.providerId, "github"), eq(account.userId, userId)))
    .limit(1);

  return row?.accessToken ?? null;
}

/**
 * Fetch the authenticated user's repositories from the GitHub REST API.
 * Returns a mapped, app-shaped array. Throws on a non-ok response.
 */
export async function fetchUserRepos(token: string): Promise<GithubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "ourfolio",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = (await res.json()) as Array<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
  }>;

  return data.map((repo) => ({
    repoId: String(repo.id),
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    stars: repo.stargazers_count,
    language: repo.language,
  }));
}

/**
 * Map a GitHub repo into a `projects` insert object.
 */
export function repoToProjectValues(repo: GithubRepo, profileId: string) {
  return {
    profileId,
    title: repo.name,
    description: repo.description ?? null,
    repoUrl: repo.htmlUrl,
    repoId: repo.repoId,
    stars: repo.stars ?? null,
    language: repo.language ?? null,
    stack: repo.language ? [repo.language] : [],
    lastSyncedAt: new Date(),
    githubPinned: true,
  };
}
