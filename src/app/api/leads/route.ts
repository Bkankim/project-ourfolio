import { NextResponse } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const { profileId } = await getAuthSession();

    const result = await db
      .select()
      .from(leads)
      .where(eq(leads.profileId, profileId))
      .orderBy(sql`${leads.createdAt} desc`);

    return NextResponse.json({ leads: result });
  } catch (err) {
    return handleApiError(err);
  }
}
