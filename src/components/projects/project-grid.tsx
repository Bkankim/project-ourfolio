"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { Pencil, Trash2, Star, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import type { ProjectClient as Project } from "@/types/portfolio";

interface ProjectGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, newOrder: number) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

export function ProjectGrid({
  projects,
  onEdit,
  onDelete,
  onReorder,
  onToggleFeatured,
}: ProjectGridProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, idx) => (
        <Card key={project.id} className="group relative overflow-hidden">
          {project.imageUrl && (
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold truncate">{project.title}</h3>
              {project.featured && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
              )}
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
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

            <div className="flex items-center gap-1 pt-2 border-t border-border/40">
              <Button variant="ghost" size="sm" onClick={() => onEdit(project)} title={t("editProject")}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFeatured(project.id, !project.featured)}
                title={t("projectFeatured")}
              >
                <Star className={`h-3.5 w-3.5 ${project.featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              {project.externalLink && (
                <a href={project.externalLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === 0}
                onClick={() => onReorder(project.id, project.displayOrder - 1)}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={idx === projects.length - 1}
                onClick={() => onReorder(project.id, project.displayOrder + 1)}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm(t("deleteProjectConfirm"))) {
                    onDelete(project.id);
                  }
                }}
                title={t("deleteProject")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
