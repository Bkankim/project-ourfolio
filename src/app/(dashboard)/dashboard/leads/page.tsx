"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadList } from "@/components/leads/lead-list";
import type { LeadClient as Lead } from "@/types/portfolio";

export default function LeadsPage() {
  const { t } = useI18n();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetFilter, setBudgetFilter] = useState("all");

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setLeads(data.leads))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleRead = async (id: string, isRead: boolean) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isRead } : l))
      );
    }
  };

  const filtered =
    budgetFilter === "all"
      ? leads
      : leads.filter((l) => l.budgetRange === budgetFilter);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("leadsTitle")}</h1>
        <p className="text-muted-foreground">{t("leadsDesc")}</p>
      </div>

      <LeadList
        leads={filtered}
        budgetFilter={budgetFilter}
        onBudgetFilterChange={setBudgetFilter}
        onToggleRead={handleToggleRead}
      />
    </div>
  );
}
