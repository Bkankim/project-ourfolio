"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ExternalLink } from "lucide-react";
import type { TemplateStyle } from "@/components/portfolio/template-styles";

interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  tags: string[] | null;
  externalLink: string | null;
  featured: boolean;
}

interface PortfolioProjectsProps {
  projects: Project[];
  style: TemplateStyle;
}

export function PortfolioProjects({ projects, style }: PortfolioProjectsProps) {
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);

  const featured = projects.filter((p) => p.featured);
  const displayed = showAll ? projects : (featured.length > 0 ? featured : projects.slice(0, 6));

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">{t("featuredProjects")}</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {displayed.map((project) => (
          <div
            key={project.id}
            className={`rounded-xl overflow-hidden ${style.card} transition-transform hover:scale-[1.02]`}
          >
            {project.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{project.title}</h3>
                {project.externalLink && (
                  <a
                    href={project.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style.muted}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {project.description && (
                <p className={`text-sm ${style.muted} line-clamp-2`}>
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {project.category && (
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                )}
                {project.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && projects.length > displayed.length && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="rounded-xl"
          >
            {t("viewAllProjects")}
          </Button>
        </div>
      )}
    </section>
  );
}
