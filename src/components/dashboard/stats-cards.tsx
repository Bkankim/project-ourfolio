"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Eye, MousePointerClick, Users } from "lucide-react";

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
      title: t("totalViews"),
      value: stats.views,
      change: stats.viewsChange,
      icon: Eye,
    },
    {
      title: t("ctaClicks"),
      value: stats.ctaClicks,
      change: stats.ctaChange,
      icon: MousePointerClick,
    },
    {
      title: t("totalLeads"),
      value: stats.totalLeads,
      change: stats.leadsChange,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.title}
            </CardTitle>
            <c.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {c.change >= 0 ? "+" : ""}
              {c.change} {t("vsLastWeek")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
