import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getGithubToken, fetchUserRepos } from "@/lib/github";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId, profileId } = await getAuthSession();
    const { projectId } = await params;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.profileId, profileId)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.repoId) {
      return NextResponse.json(
        { error: "Project is not linked to a GitHub repo" },
        { status: 400 }
      );
    }

    const token = await getGithubToken(userId);
    if (!token) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    const repo = (await fetchUserRepos(token)).find(
      (r) => r.repoId === project.repoId
    );
    if (!repo) {
      return NextResponse.json(
        { error: "Repo no longer accessible on GitHub" },
        { status: 404 }
      );
    }

    // Refresh ONLY synced metadata; never touch user-editable fields.
    const [updated] = await db
      .update(projects)
      .set({
        stars: repo.stars ?? null,
        language: repo.language ?? null,
        lastSyncedAt: new Date(),
      })
      .where(eq(projects.id, project.id))
      .returning();

    return NextResponse.json({ project: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
