import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthUser, handleApiError } from "@/lib/auth-guard";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { listObjects, deleteObjects } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`account-delete:${ip}`, 1, 3_600_000);
    if (!success) return rateLimitResponse(3600);

    const { userId } = await getAuthUser();

    // 1. Find profile to get the R2 prefix
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    // 2. Delete R2 images (user-specific prefix, before DB deletion)
    if (profile) {
      try {
        const prefix = `uploads/${profile.id}/`;
        const objects = await listObjects(prefix);
        if (objects.length > 0) {
          await deleteObjects(objects);
        }
      } catch (err) {
        console.error("[account-delete] R2 cleanup failed:", err);
      }
    }

    // 3. Delete profiles (cascades to projects, case_studies, leads, analytics_events)
    if (profile) {
      await db.delete(profiles).where(eq(profiles.id, profile.id));
    }

    // 4. Delete BetterAuth user (cascades to session, account, consents)
    // Note: Neon HTTP driver does not support multi-statement transactions.
    // Step 3→4 failure risk is minimal (single DELETE by PK). If step 4 fails,
    // the user can retry deletion.
    await db.execute(sql`DELETE FROM "user" WHERE id = ${userId}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
