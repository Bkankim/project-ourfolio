"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { FolderPlus, FileText, Eye } from "lucide-react";

interface QuickActionsProps {
  username?: string | null;
}

export function QuickActions({ username }: QuickActionsProps) {
  const { t } = useI18n();

  const actions = [
    {
      label: t("addProject"),
      icon: FolderPlus,
      href: "/dashboard/projects",
      external: false,
    },
    {
      label: t("writeCaseStudy"),
      icon: FileText,
      href: "/dashboard/case-studies",
      external: false,
    },
    {
      label: t("viewPortfolio"),
      icon: Eye,
      href: username ? `/${username}` : "/dashboard",
      external: !!username,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("quickActions")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            className="rounded-xl border border-border/40 bg-card p-6 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform duration-200 cursor-pointer text-center"
          >
            <action.icon className="h-7 w-7 text-primary" />
            <span className="font-medium text-sm">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
