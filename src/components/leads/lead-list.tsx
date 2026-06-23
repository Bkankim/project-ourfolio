"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { formatDistanceToNow } from "date-fns";
import { Mail, ChevronDown, Eye, EyeOff } from "lucide-react";
import type { LeadClient as Lead } from "@/types/portfolio";
import { INQUIRY_TYPES } from "@/types/portfolio";

interface LeadListProps {
  leads: Lead[];
  inquiryFilter: string;
  onInquiryFilterChange: (value: string) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
}

const ALL_INQUIRY_TYPES = [{ value: "all", key: "inquiryAll" }, ...INQUIRY_TYPES] as const;

export function LeadList({
  leads,
  inquiryFilter,
  onInquiryFilterChange,
  onToggleRead,
}: LeadListProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={inquiryFilter}
          onValueChange={(v) => onInquiryFilterChange(v ?? "all")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_INQUIRY_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.key)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("leadsEmpty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Collapsible key={lead.id}>
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <CollapsibleTrigger className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {lead.senderName}
                      </span>
                      {!lead.isRead && (
                        <Badge variant="default" className="text-xs px-1.5 py-0">
                          {t("unread")}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lead.senderEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {lead.inquiryType && (
                      <Badge variant="secondary" className="text-xs">
                        {t(
                          INQUIRY_TYPES.find(
                            (o) => o.value === lead.inquiryType
                          )?.key ?? "inquiryOther"
                        )}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lead.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                    {lead.message && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {lead.message}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => onToggleRead(lead.id, !lead.isRead)}
                      >
                        {lead.isRead ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            {t("markAsUnread")}
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            {t("markAsRead")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
