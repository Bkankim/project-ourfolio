import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { caseStudies } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { updateCaseStudySchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profileId } = await getAuthSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateCaseStudySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(caseStudies)
      .set(parsed.data)
      .where(and(eq(caseStudies.id, id), eq(caseStudies.profileId, profileId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    return NextResponse.json({ caseStudy: updated });
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
      .delete(caseStudies)
      .where(and(eq(caseStudies.id, id), eq(caseStudies.profileId, profileId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
