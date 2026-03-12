"use client";

import { useI18n } from "@/lib/i18n";

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

  const checklist = [
    { done: data.items.hasAvatar, label: t("scoreProfilePhoto") },
    { done: data.items.hasBio, label: t("scoreBio") },
    { done: data.items.hasProjects, label: t("scoreProjects") },
    { done: data.items.hasCaseStudy, label: t("scoreCaseStudy") },
    { done: data.items.hasSocialLinks, label: t("scoreSocialLinks") },
  ];

  const scorePercent = data.score;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scorePercent / 100) * circumference;

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 self-start">
        {t("portfolioScore")}
      </h2>

      <div className="relative w-36 h-36 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className="stroke-muted/30"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className="transition-all duration-700"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ stroke: "#FBBF24" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
          {scorePercent}%
        </span>
      </div>

      <ul className="w-full space-y-3">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-sm border flex items-center justify-center text-xs ${
                item.done
                  ? "bg-accent border-accent text-accent-foreground"
                  : "border-muted-foreground/30"
              }`}
            >
              {item.done && "\u2713"}
            </div>
            <span
              className={
                item.done
                  ? "text-muted-foreground line-through"
                  : "text-foreground text-sm"
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
