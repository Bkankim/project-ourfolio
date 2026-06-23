import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  getGithubToken,
  fetchUserRepos,
  repoToProjectValues,
} from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const { userId, profileId } = await getAuthSession();

    const body = await request.json().catch(() => null);
    const repoIds = (body as { repoIds?: unknown } | null)?.repoIds;
    if (
      !Array.isArray(repoIds) ||
      repoIds.length === 0 ||
      !repoIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        { error: "repoIds must be a non-empty array of strings" },
        { status: 400 }
      );
    }
    const selected = new Set(repoIds as string[]);

    const token = await getGithubToken(userId);
    if (!token) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    const repos = (await fetchUserRepos(token)).filter((r) =>
      selected.has(r.repoId)
    );

    const imported = [];
    for (const repo of repos) {
      const [existing] = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.profileId, profileId),
            eq(projects.repoId, repo.repoId)
          )
        )
        .limit(1);

      if (existing) {
        // Idempotent: refresh only the synced metadata, preserve user edits.
        const [updated] = await db
          .update(projects)
          .set({
            stars: repo.stars ?? null,
            language: repo.language ?? null,
            lastSyncedAt: new Date(),
          })
          .where(eq(projects.id, existing.id))
          .returning();
        imported.push(updated);
      } else {
        const [created] = await db
          .insert(projects)
          .values(repoToProjectValues(repo, profileId))
          .returning();
        imported.push(created);
      }
    }

    return NextResponse.json({ imported: imported.length, projects: imported });
  } catch (err) {
    return handleApiError(err);
  }
}
