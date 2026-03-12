import { NextResponse, type NextRequest } from "next/server";
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
import { getAuthUser, handleApiError } from "@/lib/auth-guard";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { success } = rateLimit(`account-export:${ip}`, 3, 3_600_000);
    if (!success) return rateLimitResponse(3600);

    const { userId } = await getAuthUser();

    // Fetch user + profile in parallel (independent queries)
    const [userRows, [profile]] = await Promise.all([
      db.execute(
        sql`SELECT id, name, email, "emailVerified", image, "createdAt" FROM "user" WHERE id = ${userId} LIMIT 1`,
      ),
      db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1),
    ]);
    const user = userRows.rows[0] ?? null;
    const profileId = profile?.id;

    // Fetch all related data in parallel (empty arrays if no profile)
    // Note: account table intentionally excluded (contains accessToken/refreshToken/password)
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
  } catch (err) {
    return handleApiError(err);
  }
}
