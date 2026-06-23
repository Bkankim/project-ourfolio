import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { ProjectsReveal } from "@/components/portfolio/projects-reveal";
import type { TemplateStyle } from "@/components/portfolio/template-styles";

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

interface PortfolioProjectsProps {
  projects: Project[];
  style: TemplateStyle;
  headingLabel: string;
  viewAllLabel: string;
  demoLabel: string;
  sourceLabel: string;
}

function ProjectCard({
  project,
  style,
  demoLabel,
  sourceLabel,
}: {
  project: Project;
  style: TemplateStyle;
  demoLabel: string;
  sourceLabel: string;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${style.card} transition-transform hover:scale-[1.02]`}
    >
      {project.imageUrl && (
        <div className="aspect-video overflow-hidden relative">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">{project.title}</h3>
        {project.role && (
          <p className={`text-xs ${style.accent} font-medium`}>{project.role}</p>
        )}
        {project.description && (
          <p className={`text-sm ${style.muted} line-clamp-2`}>
            {project.description}
          </p>
        )}
        {project.bodyMarkdown && (
          <p className={`text-sm ${style.muted} whitespace-pre-wrap line-clamp-6`}>
            {project.bodyMarkdown}
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
        {project.stack && project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs border-[var(--portfolio-primary)]/40"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
        {(project.demoUrl || project.repoUrl) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--portfolio-primary)" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {demoLabel}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg border ${style.border} ${style.muted} px-3 py-1.5 text-xs font-medium transition hover:opacity-80`}
              >
                <Github className="h-3.5 w-3.5" />
                {sourceLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PortfolioProjects({
  projects,
  style,
  headingLabel,
  viewAllLabel,
  demoLabel,
  sourceLabel,
}: PortfolioProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const initial = featured.length > 0 ? featured : projects.slice(0, 6);
  const initialIds = new Set(initial.map((p) => p.id));
  const rest = projects.filter((p) => !initialIds.has(p.id));

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">{headingLabel}</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {initial.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            style={style}
            demoLabel={demoLabel}
            sourceLabel={sourceLabel}
          />
        ))}
      </div>

      {rest.length > 0 && (
        <ProjectsReveal label={viewAllLabel}>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {rest.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                style={style}
                demoLabel={demoLabel}
                sourceLabel={sourceLabel}
              />
            ))}
          </div>
        </ProjectsReveal>
      )}
    </section>
  );
}
