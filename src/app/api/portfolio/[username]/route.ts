import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, projects, caseStudies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _request: Request,
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

  const [userProjects, userCaseStudies] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(eq(projects.profileId, profile.id))
      .orderBy(asc(projects.displayOrder)),
    db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.profileId, profile.id))
      .orderBy(asc(caseStudies.displayOrder)),
  ]);

  return NextResponse.json({
    profile,
    projects: userProjects,
    caseStudies: userCaseStudies,
  });
}
