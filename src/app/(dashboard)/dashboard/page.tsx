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

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!data) {
    return (
      <div className="animate-fade-in space-y-8">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("welcomeBack")} {displayName}{t("welcomeBackSuffix")}
        </h1>
        <p className="text-muted-foreground mt-1">{formattedDate}</p>
      </div>

      <StatsCards stats={data.stats} />

      <WeeklyChart dailyViews={data.dailyViews} viewsTrend={data.stats.viewsChange} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioScore data={data.portfolioScore} />
        <div className="lg:col-span-2 space-y-6">
          <QuickActions username={profile?.username} />
          <RecentLeads leads={data.recentLeads} />
        </div>
      </div>
    </div>
  );
}
