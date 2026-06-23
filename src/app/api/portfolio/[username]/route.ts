import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, projects } from "@/db/schema";
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

  const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.profileId, profile.id))
      .orderBy(asc(projects.displayOrder));

  return NextResponse.json(
    {
      profile,
      projects: userProjects,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
