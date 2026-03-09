import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { profiles, projects, caseStudies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getProfileByUsername = cache(async (username: string) => {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);
  return profile ?? null;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return { title: "Not Found" };
  }

  return {
    title: `${profile.fullName ?? username} — OurFolio`,
    description: profile.tagline ?? profile.bio ?? `${username}'s portfolio`,
    openGraph: {
      title: `${profile.fullName ?? username} — OurFolio`,
      description: profile.tagline ?? profile.bio ?? undefined,
      ...(profile.avatarUrl ? { images: [{ url: profile.avatarUrl }] } : {}),
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
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

  return (
    <PortfolioClient
      profile={profile}
      projects={userProjects}
      caseStudies={userCaseStudies}
    />
  );
}
