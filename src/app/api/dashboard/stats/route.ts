import { NextResponse } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { projects, leads, analyticsEvents } from "@/db/schema";
import { eq, and, gte, count, sql } from "drizzle-orm";

export async function GET() {
  try {
    const { profileId, profile } = await getAuthSession();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Parallel queries
    const [
      projectCount,
      totalLeadCount,
      recentLeads,
      viewsThisWeek,
      viewsLastWeek,
      ctaThisWeek,
      ctaLastWeek,
      leadsThisWeek,
      leadsLastWeek,
      dailyViews,
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.profileId, profileId)),
      db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.profileId, profileId)),
      db
        .select()
        .from(leads)
        .where(eq(leads.profileId, profileId))
        .orderBy(sql`${leads.createdAt} desc`)
        .limit(3),
      db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.profileId, profileId),
            eq(analyticsEvents.eventType, "page_view"),
            gte(analyticsEvents.createdAt, sevenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.profileId, profileId),
            eq(analyticsEvents.eventType, "page_view"),
            gte(analyticsEvents.createdAt, fourteenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.profileId, profileId),
            eq(analyticsEvents.eventType, "cta_click"),
            gte(analyticsEvents.createdAt, sevenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.profileId, profileId),
            eq(analyticsEvents.eventType, "cta_click"),
            gte(analyticsEvents.createdAt, fourteenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(leads)
        .where(
          and(
            eq(leads.profileId, profileId),
            gte(leads.createdAt, sevenDaysAgo)
          )
        ),
      db
        .select({ count: count() })
        .from(leads)
        .where(
          and(
            eq(leads.profileId, profileId),
            gte(leads.createdAt, fourteenDaysAgo)
          )
        ),
      // Daily view counts for chart (last 7 days)
      db
        .select({
          day: sql<string>`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`,
          count: count(),
        })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.profileId, profileId),
            eq(analyticsEvents.eventType, "page_view"),
            gte(analyticsEvents.createdAt, sevenDaysAgo)
          )
        )
        .groupBy(
          sql`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`
        ),
    ]);

    // Portfolio score calculation
    const hasBio = Boolean(profile.bio);
    const hasAvatar = Boolean(profile.avatarUrl);
    const hasProjects = (projectCount[0]?.count ?? 0) >= 3;
    const hasSocialLinks =
      Object.values(
        (profile.socialLinks as Record<string, string>) ?? {}
      ).filter(Boolean).length > 0;

    const scoreItems = [
      hasAvatar,
      hasBio,
      hasProjects,
      hasSocialLinks,
    ];
    const score = Math.round(
      (scoreItems.filter(Boolean).length / scoreItems.length) * 100
    );

    return NextResponse.json({
      stats: {
        views: viewsThisWeek[0]?.count ?? 0,
        viewsChange: (viewsThisWeek[0]?.count ?? 0) - ((viewsLastWeek[0]?.count ?? 0) - (viewsThisWeek[0]?.count ?? 0)),
        ctaClicks: ctaThisWeek[0]?.count ?? 0,
        ctaChange: (ctaThisWeek[0]?.count ?? 0) - ((ctaLastWeek[0]?.count ?? 0) - (ctaThisWeek[0]?.count ?? 0)),
        totalLeads: totalLeadCount[0]?.count ?? 0,
        leadsThisWeek: leadsThisWeek[0]?.count ?? 0,
        leadsChange: (leadsThisWeek[0]?.count ?? 0) - ((leadsLastWeek[0]?.count ?? 0) - (leadsThisWeek[0]?.count ?? 0)),
      },
      dailyViews,
      portfolioScore: {
        score,
        items: {
          hasAvatar,
          hasBio,
          hasProjects,
          hasSocialLinks,
        },
      },
      recentLeads,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
