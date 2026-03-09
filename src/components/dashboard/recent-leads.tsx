"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";
import type { LeadClient as Lead } from "@/types/portfolio";

interface RecentLeadsProps {
  leads: Lead[];
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t("recentLeads")}</CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noLeadsYet")}</p>
        ) : (
          <ul className="space-y-3">
            {leads.map((lead) => (
              <li key={lead.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{lead.senderName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {lead.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {!lead.isRead && (
                    <Badge variant="default" className="text-xs px-1.5 py-0">
                      {t("unread")}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(lead.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
