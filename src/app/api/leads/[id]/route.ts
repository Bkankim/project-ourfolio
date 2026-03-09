import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { toggleReadSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profileId } = await getAuthSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = toggleReadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(leads)
      .set({ isRead: parsed.data.isRead })
      .where(and(eq(leads.id, id), eq(leads.profileId, profileId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
