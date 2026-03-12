import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles, consents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { listObjects, deleteObjects } from "@/lib/r2";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Find profile to get the R2 prefix
  const [profile] = await db
    .select({ id: profiles.id, username: profiles.username })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  // 2. Delete R2 images (user-specific prefix)
  if (profile) {
    try {
      const prefix = `uploads/${profile.id}/`;
      const objects = await listObjects(prefix);
      if (objects.length > 0) {
        await deleteObjects(objects);
      }
    } catch (err) {
      console.error("[account-delete] R2 cleanup failed:", err);
      // Continue with DB deletion even if R2 fails
    }
  }

  // 3. Delete profiles (cascades to projects, case_studies, leads, analytics_events)
  if (profile) {
    await db.delete(profiles).where(eq(profiles.id, profile.id));
  }

  // 4. Delete consent records
  await db.delete(consents).where(eq(consents.userId, userId));

  // 5. Delete BetterAuth user (cascades to session, account)
  await db.execute(sql`DELETE FROM "user" WHERE id = ${userId}`);

  return NextResponse.json({ ok: true });
}
