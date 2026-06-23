import { Download } from "lucide-react";
import { getTemplateStyle } from "@/components/portfolio/template-styles";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioSkills } from "@/components/portfolio/portfolio-skills";
import { PortfolioProjects } from "@/components/portfolio/portfolio-projects";
import { PortfolioContact } from "@/components/portfolio/portfolio-contact";
import { PageViewBeacon } from "@/components/portfolio/page-view-beacon";
import { getT } from "@/lib/i18n-server";
import type { Locale } from "@/lib/i18n-translations";
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
  skills: string[] | null;
  resumeUrl: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  tags: string[] | null;
  demoUrl: string | null;
  repoUrl: string | null;
  role: string | null;
  stack: string[] | null;
  bodyMarkdown: string | null;
  featured: boolean;
}

interface PortfolioViewProps {
  profile: Profile;
  projects: Project[];
  locale: Locale;
}

/**
 * Server-rendered portfolio container. Hero, skills and project cards are
 * rendered on the server (visible without client JS); only the CTA, the
 * "view all" toggle, the contact form, and the page-view beacon are hydrated
 * client islands.
 */
export function PortfolioView({ profile, projects, locale }: PortfolioViewProps) {
  const t = getT(locale);
  const template = (profile.template as Template) ?? "darktech";
  const style = getTemplateStyle(template);

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
          ctaLabel={t("letsWorkTogether")}
        />

        {profile.resumeUrl && (
          <div className="flex justify-center">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:opacity-80"
              style={{
                borderColor: "var(--portfolio-primary)",
                color: "var(--portfolio-primary)",
              }}
            >
              <Download className="h-4 w-4" />
              {t("resumeDownload")}
            </a>
          </div>
        )}

        <PortfolioSkills
          skills={profile.skills ?? []}
          style={style}
          heading={t("skillsHeading")}
        />

        {projects.length > 0 && (
          <PortfolioProjects
            projects={projects}
            style={style}
            headingLabel={t("featuredProjects")}
            viewAllLabel={t("viewAllProjects")}
            demoLabel={t("viewDemo")}
            sourceLabel={t("viewSource")}
          />
        )}

        <PortfolioContact
          profileId={profile.id}
          username={profile.username ?? ""}
          style={style}
          locale={locale}
        />

        <PageViewBeacon profileId={profile.id} />
      </div>
    </div>
  );
}
