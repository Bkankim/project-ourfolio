import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { profiles, leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { contactFormSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  if (!profile) {
    return NextResponse.json(
      { error: "Portfolio not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const [lead] = await db
    .insert(leads)
    .values({
      profileId: profile.id,
      senderName: parsed.data.senderName,
      senderEmail: parsed.data.senderEmail,
      message: parsed.data.message,
      budgetRange: parsed.data.budgetRange ?? null,
    })
    .returning();

  return NextResponse.json({ lead }, { status: 201 });
}
