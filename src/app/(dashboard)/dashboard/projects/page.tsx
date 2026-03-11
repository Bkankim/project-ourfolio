"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectGrid } from "@/components/projects/project-grid";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { ProjectClient as Project } from "@/types/portfolio";

export default function ProjectsPage() {
  const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/projects", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setProjects(data.projects);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(t("deleteProject"));
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (editingProject) {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchProjects();
        toast.success(t("save"));
      }
    } else {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchProjects();
        toast.success(t("save"));
      }
    }
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleReorder = async (id: string, newOrder: number) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayOrder: newOrder }),
    });
    await fetchProjects();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    await fetchProjects();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("projectsTitle")}</h1>
          <p className="text-muted-foreground">{t("projectsDesc")}</p>
        </div>
        <Button
          className="rounded-xl gap-2"
          onClick={() => {
            setEditingProject(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("addProject")}
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t("projectsEmpty")}</p>
      ) : (
        <ProjectGrid
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      <ProjectDialog
        key={dialogOpen ? (editingProject?.id ?? "new") : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSave={handleSave}
      />
    </div>
  );
}
