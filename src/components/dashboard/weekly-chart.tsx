"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { BarChart3 } from "lucide-react";

interface WeeklyChartProps {
  dailyViews: { day: string; count: number }[];
  viewsTrend?: number;
}

export function WeeklyChart({ dailyViews, viewsTrend = 0 }: WeeklyChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    const now = new Date();
    const days: { label: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: "short" });
      const match = dailyViews.find((v) => v.day === key);
      days.push({ label: dayLabel, count: match?.count ?? 0 });
    }

    return days;
  }, [dailyViews]);

  const max = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">
          {t("totalViews")} — {t("last7Days")}
        </h2>
        {viewsTrend !== 0 && (
          <span
            className={`ml-auto text-xs font-medium ${
              viewsTrend >= 0 ? "text-green-500" : "text-red-400"
            }`}
          >
            {viewsTrend > 0 ? "+" : ""}
            {viewsTrend}% {t("vsLastWeek")}
          </span>
        )}
      </div>
      <div className="flex items-end gap-2 h-32">
        {chartData.map((d) => (
          <div
            key={d.label}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <span className="text-[10px] text-muted-foreground font-medium">
              {d.count > 0 ? d.count : ""}
            </span>
            <div
              className="w-full rounded-t-md bg-primary/80 transition-all duration-500"
              style={{
                height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 2)}%`,
                minHeight: d.count > 0 ? "6px" : "2px",
                opacity: d.count > 0 ? 1 : 0.2,
              }}
            />
            <span className="text-[10px] text-muted-foreground">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
