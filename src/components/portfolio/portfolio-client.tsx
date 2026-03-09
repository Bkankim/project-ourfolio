"use client";

import { useEffect } from "react";
import { getTemplateStyle } from "@/components/portfolio/template-styles";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioProjects } from "@/components/portfolio/portfolio-projects";
import { PortfolioCaseStudies } from "@/components/portfolio/portfolio-case-studies";
import { PortfolioContact } from "@/components/portfolio/portfolio-contact";
import { trackEvent } from "@/lib/analytics";
import type { Template, SocialLinks } from "@/types/portfolio";

interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  username: string | null;
  bio: string | null;
  tagline: string | null;
  profession: string | null;
  template: string;
  primaryColor: string;
  accentColor: string;
  socialLinks: unknown;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  tags: string[] | null;
  externalLink: string | null;
  featured: boolean;
  displayOrder: number;
}

interface CaseStudy {
  id: string;
  title: string;
  clientName: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  metrics: unknown;
  coverImageUrl: string | null;
}

interface PortfolioClientProps {
  profile: Profile;
  projects: Project[];
  caseStudies: CaseStudy[];
}

export function PortfolioClient({
  profile,
  projects,
  caseStudies,
}: PortfolioClientProps) {
  const template = (profile.template as Template) ?? "darktech";
  const style = getTemplateStyle(template);

  useEffect(() => {
    trackEvent(profile.id, "page_view");
  }, [profile.id]);

  return (
    <div
      className={`min-h-screen ${style.bg} ${style.text}`}
      style={
        {
          "--portfolio-primary": profile.primaryColor,
          "--portfolio-accent": profile.accentColor,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-16">
        <PortfolioHero
          profile={profile}
          socialLinks={(profile.socialLinks as SocialLinks) ?? {}}
          style={style}
        />

        {projects.length > 0 && (
          <PortfolioProjects projects={projects} style={style} />
        )}

        {caseStudies.length > 0 && (
          <PortfolioCaseStudies caseStudies={caseStudies} style={style} />
        )}

        <PortfolioContact
          profileId={profile.id}
          username={profile.username ?? ""}
          style={style}
        />
      </div>
    </div>
  );
}
