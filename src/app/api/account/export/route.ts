import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  profiles,
  projects,
  caseStudies,
  leads,
  analyticsEvents,
  consents,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Fetch user record from BetterAuth
  const userRows = await db.execute(
    sql`SELECT id, name, email, "emailVerified", image, "createdAt" FROM "user" WHERE id = ${userId} LIMIT 1`,
  );
  const user = userRows.rows[0] ?? null;

  // Fetch profile
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  const profileId = profile?.id;

  // Fetch all related data (empty arrays if no profile)
  const [userProjects, userCaseStudies, userLeads, userEvents, userConsents] =
    profileId
      ? await Promise.all([
          db.select().from(projects).where(eq(projects.profileId, profileId)),
          db.select().from(caseStudies).where(eq(caseStudies.profileId, profileId)),
          db.select().from(leads).where(eq(leads.profileId, profileId)),
          db.select().from(analyticsEvents).where(eq(analyticsEvents.profileId, profileId)),
          db.select().from(consents).where(eq(consents.userId, userId)),
        ])
      : [[], [], [], [], []];

  const exportData = {
    exportedAt: new Date().toISOString(),
    user,
    profile: profile ?? null,
    projects: userProjects,
    caseStudies: userCaseStudies,
    leads: userLeads,
    analyticsEvents: userEvents,
    consents: userConsents,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="ourfolio-export.json"',
    },
  });
}
