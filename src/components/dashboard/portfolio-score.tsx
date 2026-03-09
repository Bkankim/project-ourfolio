"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, Circle } from "lucide-react";

interface PortfolioScoreProps {
  data: {
    score: number;
    items: {
      hasAvatar: boolean;
      hasBio: boolean;
      hasProjects: boolean;
      hasCaseStudy: boolean;
      hasSocialLinks: boolean;
    };
  };
}

export function PortfolioScore({ data }: PortfolioScoreProps) {
  const { t } = useI18n();

  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (data.score / 100) * circumference;

  const checklist = [
    { done: data.items.hasAvatar, label: t("scoreProfilePhoto") },
    { done: data.items.hasBio, label: t("scoreBio") },
    { done: data.items.hasProjects, label: t("scoreProjects") },
    { done: data.items.hasCaseStudy, label: t("scoreCaseStudy") },
    { done: data.items.hasSocialLinks, label: t("scoreSocialLinks") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("portfolioScore")}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width={96} height={96} viewBox="0 0 96 96">
            <circle cx={48} cy={48} r={r} fill="none" stroke="currentColor" strokeWidth={6} className="text-muted/30" />
            <circle
              cx={48}
              cy={48}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-primary transition-all duration-700"
              transform="rotate(-90 48 48)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {data.score}%
          </span>
        </div>
        <ul className="space-y-2 text-sm">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
