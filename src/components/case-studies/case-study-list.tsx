"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { Pencil, Trash2, BarChart3 } from "lucide-react";
import type { CaseStudyClient as CaseStudy, ProfessionTemplate } from "@/types/portfolio";
import { PROFESSION_LABEL_MAP } from "@/types/portfolio";

interface CaseStudyListProps {
  items: CaseStudy[];
  onEdit: (item: CaseStudy) => void;
  onDelete: (id: string) => void;
}

export function CaseStudyList({ items, onEdit, onDelete }: CaseStudyListProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="flex">
            {item.coverImageUrl && (
              <div className="w-40 shrink-0 overflow-hidden bg-muted hidden sm:block relative">
                <Image
                  src={item.coverImageUrl}
                  alt={item.title}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="flex-1 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.clientName && (
                    <p className="text-sm text-muted-foreground">{item.clientName}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.professionTemplate && PROFESSION_LABEL_MAP[item.professionTemplate as ProfessionTemplate] && (
                    <Badge variant="secondary" className="text-xs">
                      {t(PROFESSION_LABEL_MAP[item.professionTemplate as ProfessionTemplate] as Parameters<typeof t>[0])}
                    </Badge>
                  )}
                </div>
              </div>

              {item.problem && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.problem}
                </p>
              )}

              {item.metrics.length > 0 && (
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                  {item.metrics.slice(0, 3).map((m) => (
                    <span key={m.label} className="text-xs text-muted-foreground">
                      {m.label}: <strong>{m.value}</strong>{m.unit}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 pt-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  {t("editCaseStudy")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm(t("deleteConfirm"))) {
                      onDelete(item.id);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  {t("deleteCaseStudy")}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
