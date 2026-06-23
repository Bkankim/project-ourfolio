import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getAuthUser, handleApiError } from "@/lib/auth-guard";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { listObjects, deleteObjects, R2_FOLDERS } from "@/lib/r2";

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

    // 2. Delete profile first (cascade: projects, leads, analytics_events)
    // DB before R2 — if DB fails, no images are lost on a still-active account
    if (profile) {
      await db.delete(profiles).where(eq(profiles.id, profile.id));

      // 3. R2 image cleanup (best-effort — orphaned objects are harmless)
      try {
        const prefixes = R2_FOLDERS.map((f) => `${f}/${profile.id}/`);
        const lists = await Promise.all(prefixes.map(listObjects));
        const allKeys = lists.flat();
        if (allKeys.length > 0) {
          await deleteObjects(allKeys);
        }
      } catch (err) {
        console.error("[account-delete] R2 cleanup failed:", err);
      }
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
