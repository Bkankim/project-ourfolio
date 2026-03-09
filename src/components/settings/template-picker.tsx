"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Template } from "@/types/portfolio";

interface TemplatePickerProps {
  template: Template;
  setTemplate: (v: Template) => void;
}

const TEMPLATES: { value: Template; nameKey: string; descKey: string; preview: string }[] = [
  {
    value: "minimal",
    nameKey: "templateMinimal",
    descKey: "templateMinimalDesc",
    preview: "bg-white border-gray-200",
  },
  {
    value: "bold",
    nameKey: "templateBold",
    descKey: "templateBoldDesc",
    preview: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    value: "darktech",
    nameKey: "templateDarkTech",
    descKey: "templateDarkTechDesc",
    preview: "bg-gray-900 border-cyan-400/50",
  },
];

export function TemplatePicker({ template, setTemplate }: TemplatePickerProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("templateSection")}</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.value}
            onClick={() => setTemplate(tmpl.value)}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all hover:ring-2 hover:ring-primary/30",
              template === tmpl.value
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/50"
            )}
          >
            <div
              className={cn(
                "h-20 rounded-lg mb-3 border",
                tmpl.preview
              )}
            />
            <p className="font-medium text-sm">
              {t(tmpl.nameKey as Parameters<typeof t>[0])}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(tmpl.descKey as Parameters<typeof t>[0])}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
