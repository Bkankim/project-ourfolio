import { NextResponse } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { parseLimit } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { profileId } = await getAuthSession();
    const limit = parseLimit(request.url);

    const result = await db
      .select()
      .from(leads)
      .where(eq(leads.profileId, profileId))
      .orderBy(sql`${leads.createdAt} desc`)
      .limit(limit);

    return NextResponse.json({ leads: result });
  } catch (err) {
    return handleApiError(err);
  }
}
