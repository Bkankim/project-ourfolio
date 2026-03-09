"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName } from "@/lib/utils";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { PortfolioScore } from "@/components/dashboard/portfolio-score";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentLeads } from "@/components/dashboard/recent-leads";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  stats: {
    views: number;
    viewsChange: number;
    ctaClicks: number;
    ctaChange: number;
    totalLeads: number;
    leadsThisWeek: number;
    leadsChange: number;
  };
  dailyViews: { day: string; count: number }[];
  portfolioScore: {
    score: number;
    items: {
      hasAvatar: boolean;
      hasBio: boolean;
      hasProjects: boolean;
      hasCaseStudy: boolean;
      hasSocialLinks: boolean;
    };
  };
  recentLeads: {
    id: string;
    senderName: string;
    senderEmail: string;
    message: string | null;
    budgetRange: string | null;
    isRead: boolean;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const displayName = getUserDisplayName(profile?.fullName, user?.email);

  if (!data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("welcomeBack")} {displayName}</h1>
        <p className="text-muted-foreground">{t("dashboardDesc")}</p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <WeeklyChart dailyViews={data.dailyViews} />
        <PortfolioScore data={data.portfolioScore} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <QuickActions username={profile?.username} />
        <RecentLeads leads={data.recentLeads} />
      </div>
    </div>
  );
}
