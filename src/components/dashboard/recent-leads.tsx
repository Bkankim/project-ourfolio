"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { Mail } from "lucide-react";
import type { LeadClient as Lead } from "@/types/portfolio";

interface RecentLeadsProps {
  leads: Lead[];
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const { t } = useI18n();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("recentLeads")}</h2>
      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
            <Mail className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("leadsEmpty")}
            </p>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border border-border/40 bg-card p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {lead.senderName}
                  </span>
                  <Badge
                    variant={lead.isRead ? "secondary" : "default"}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {lead.isRead ? t("read") : t("unread")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {lead.message}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
