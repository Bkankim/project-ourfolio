"use client";

import { useI18n } from "@/lib/i18n";
import { Eye, MousePointerClick, Users, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  stats: {
    views: number;
    viewsChange: number;
    ctaClicks: number;
    ctaChange: number;
    totalLeads: number;
    leadsThisWeek: number;
    leadsChange: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useI18n();

  const cards = [
    {
      label: t("totalViews"),
      value: stats.views,
      change: stats.viewsChange,
      icon: Eye,
    },
    {
      label: t("ctaClicks"),
      value: stats.ctaClicks,
      change: stats.ctaChange,
      icon: MousePointerClick,
    },
    {
      label: t("totalLeads"),
      value: stats.totalLeads,
      change: stats.leadsChange,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-border/40 bg-card p-5 flex items-center gap-4"
        >
          <div className="rounded-lg bg-primary/10 p-3">
            <c.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-2xl font-bold tracking-tight">{c.value}</p>
          </div>
          {c.change !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                c.change >= 0 ? "text-green-500" : "text-red-400"
              }`}
            >
              {c.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {c.change > 0 ? "+" : ""}
              {c.change}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
