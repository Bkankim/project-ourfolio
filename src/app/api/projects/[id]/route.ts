import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { updateProjectSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profileId } = await getAuthSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(projects)
      .set(parsed.data)
      .where(and(eq(projects.id, id), eq(projects.profileId, profileId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project: updated });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profileId } = await getAuthSession();
    const { id } = await params;

    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.profileId, profileId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
