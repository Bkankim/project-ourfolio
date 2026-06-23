import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/db";
import { resolveLocale } from "@/lib/i18n-server";
import { PortfolioView } from "@/components/portfolio/portfolio-view";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ourfolio.bkan.dev";

interface PageProps {
  params: Promise<{ username: string }>;
}

/**
 * Single relational round-trip for the public portfolio: profile + its projects
 * (ordered by displayOrder). Wrapped in cache() so generateMetadata and the page
 * body share one query per request.
 */
const getProfileByUsername = cache(async (username: string) => {
  const profile = await db.query.profiles.findFirst({
    where: (p, { eq }) => eq(p.username, username),
    with: {
      projects: {
        orderBy: (proj, { asc }) => [asc(proj.displayOrder)],
      },
    },
  });
  return profile ?? null;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return { title: "Not Found" };
  }

  const title = `${profile.fullName ?? username} — OurFolio`;
  const description = profile.tagline ?? profile.bio ?? `${username}'s portfolio`;
  const url = `${BASE_URL}/${username}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const [profile, locale] = await Promise.all([
    getProfileByUsername(username),
    resolveLocale(),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <PortfolioView
      profile={profile}
      projects={profile.projects}
      locale={locale}
    />
  );
}
