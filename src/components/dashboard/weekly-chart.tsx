"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface WeeklyChartProps {
  dailyViews: { day: string; count: number }[];
}

export function WeeklyChart({ dailyViews }: WeeklyChartProps) {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("last7Days")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-32">
          {chartData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{d.count}</span>
              <div
                className="w-full rounded-t bg-primary/80 transition-all"
                style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
              />
              <span className="text-xs text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
        {max === 1 && chartData.every((d) => d.count === 0) && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("noDataYet")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
