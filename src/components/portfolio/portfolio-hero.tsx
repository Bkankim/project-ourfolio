"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { getInitials } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Github, Linkedin, Twitter, Globe, Dribbble } from "lucide-react";
import type { SocialLinks } from "@/types/portfolio";
import type { TemplateStyle } from "@/components/portfolio/template-styles";

interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  tagline: string | null;
  bio: string | null;
  profession: string | null;
}

interface PortfolioHeroProps {
  profile: Profile;
  socialLinks: SocialLinks;
  style: TemplateStyle;
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  dribbble: Dribbble,
};

export function PortfolioHero({ profile, socialLinks, style }: PortfolioHeroProps) {
  const { t } = useI18n();

  const handleCtaClick = () => {
    trackEvent(profile.id, "cta_click");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const socialEntries = Object.entries(socialLinks).filter(
    ([, url]) => url && url.trim()
  );

  return (
    <section className="text-center space-y-6">
      <Avatar className="h-24 w-24 mx-auto ring-4 ring-[var(--portfolio-primary)]/20">
        <AvatarImage src={profile.avatarUrl ?? undefined} />
        <AvatarFallback className="text-2xl bg-[var(--portfolio-primary)]/10">
          {getInitials(profile.fullName ?? "U")}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">{profile.fullName}</h1>
        {profile.tagline && (
          <p className={`text-lg ${style.muted}`}>{profile.tagline}</p>
        )}
        {profile.profession && (
          <p className={`text-sm ${style.accent} font-medium`}>{profile.profession}</p>
        )}
      </div>

      {profile.bio && (
        <p className={`max-w-xl mx-auto ${style.muted} leading-relaxed`}>
          {profile.bio}
        </p>
      )}

      {socialEntries.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          {socialEntries.map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key];
            if (!Icon) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${style.muted} hover:${style.accent} transition-colors`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      )}

      <Button
        size="lg"
        className="rounded-xl"
        style={{ backgroundColor: "var(--portfolio-primary)" }}
        onClick={handleCtaClick}
      >
        {t("letsWorkTogether")}
      </Button>
    </section>
  );
}
