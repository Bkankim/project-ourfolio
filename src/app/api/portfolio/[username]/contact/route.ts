import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { db } from "@/db";
import { profiles, leads } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { contactFormSchema } from "@/lib/validations";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { sendLeadNotification } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`contact:${ip}`, 5, 3_600_000);

  if (!success) return rateLimitResponse(3600);

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
      inquiryType: parsed.data.inquiryType ?? null,
      privacyConsent: true,
    })
    .returning();

  // Run after response — guaranteed by Next.js runtime (won't be killed on serverless)
  after(async () => {
    try {
      const ownerRow = await db
        .execute(sql`SELECT email, name FROM "user" WHERE id = ${profile.userId} LIMIT 1`);
      const owner = ownerRow.rows[0] as { email: string; name: string } | undefined;
      if (!owner?.email) return;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      await sendLeadNotification({
        ownerEmail: owner.email,
        ownerName: owner.name ?? profile.fullName ?? username,
        senderName: parsed.data.senderName,
        senderEmail: parsed.data.senderEmail,
        message: parsed.data.message ?? null,
        inquiryType: parsed.data.inquiryType ?? null,
        portfolioUrl: `${appUrl}/${username}`,
      });
    } catch (err) {
      console.error("[lead-email] Failed to send notification:", err);
    }
  });

  return NextResponse.json({ lead }, { status: 201 });
}
