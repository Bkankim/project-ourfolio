"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CaseStudyList } from "@/components/case-studies/case-study-list";
import { CaseStudyForm } from "@/components/case-studies/case-study-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { CaseStudyClient as CaseStudy } from "@/types/portfolio";

export default function CaseStudiesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<CaseStudy | null>(null);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/case-studies");
    if (res.ok) {
      const data = await res.json();
      setItems(data.caseStudies);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item: CaseStudy) => {
    setEditing(item);
    setView("form");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/case-studies/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(t("caseStudyDeleted"));
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (editing) {
      const res = await fetch(`/api/case-studies/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast.success(t("caseStudySaved"));
    } else {
      const res = await fetch("/api/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) toast.success(t("caseStudySaved"));
    }
    await fetchItems();
    setView("list");
    setEditing(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (view === "form") {
    return (
      <CaseStudyForm
        caseStudy={editing}
        onSave={handleSave}
        onCancel={() => {
          setView("list");
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("caseStudiesTitle")}</h1>
          <p className="text-muted-foreground">{t("caseStudiesDesc")}</p>
        </div>
        <Button className="rounded-xl gap-2" onClick={() => setView("form")}>
          <Plus className="h-4 w-4" />
          {t("newCaseStudy")}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">{t("caseStudiesEmpty")}</p>
      ) : (
        <CaseStudyList items={items} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
