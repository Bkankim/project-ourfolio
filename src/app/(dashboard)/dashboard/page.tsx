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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

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
      hasSocialLinks: boolean;
    };
  };
  recentLeads: {
    id: string;
    senderName: string;
    senderEmail: string;
    message: string | null;
    inquiryType: string | null;
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

      {!profile?.username && (
        <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{t("usernameRequired")}</span>
            <Link
              href="/dashboard/settings"
              className="shrink-0 rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700 transition-colors"
            >
              {t("goToSettings")}
            </Link>
          </AlertDescription>
        </Alert>
      )}

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
