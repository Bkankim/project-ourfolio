"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";
import type { Metric } from "@/types/portfolio";
import type { TemplateStyle } from "@/components/portfolio/template-styles";

interface CaseStudy {
  id: string;
  title: string;
  clientName: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  metrics: unknown;
  coverImageUrl: string | null;
}

interface PortfolioCaseStudiesProps {
  caseStudies: CaseStudy[];
  style: TemplateStyle;
}

export function PortfolioCaseStudies({
  caseStudies,
  style,
}: PortfolioCaseStudiesProps) {
  const { t } = useI18n();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8">{t("caseStudiesSection")}</h2>

      <div className="space-y-4">
        {caseStudies.map((cs) => {
          const metrics = (Array.isArray(cs.metrics) ? cs.metrics : []) as Metric[];

          return (
            <Collapsible key={cs.id}>
              <div className={`rounded-xl overflow-hidden ${style.card}`}>
                <CollapsibleTrigger className="w-full p-4 flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{cs.title}</h3>
                    {cs.clientName && (
                      <p className={`text-sm ${style.muted}`}>{cs.clientName}</p>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 ${style.muted}`} />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className={`px-4 pb-4 space-y-4 border-t ${style.border} pt-4`}>
                    {cs.problem && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{t("problem")}</h4>
                        <p className={`text-sm ${style.muted}`}>{cs.problem}</p>
                      </div>
                    )}
                    {cs.solution && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{t("solution")}</h4>
                        <p className={`text-sm ${style.muted}`}>{cs.solution}</p>
                      </div>
                    )}
                    {cs.result && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{t("result")}</h4>
                        <p className={`text-sm ${style.muted}`}>{cs.result}</p>
                      </div>
                    )}
                    {metrics.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-2">
                        {metrics.map((m) => (
                          <Badge key={m.label} variant="secondary" className="text-sm py-1 px-3">
                            {m.label}: <strong className="ml-1">{m.value}</strong>
                            {m.unit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}
