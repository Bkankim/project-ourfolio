"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { uploadFile } from "@/lib/upload-file";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import type { CaseStudyClient as CaseStudy, ProfessionTemplate, Metric } from "@/types/portfolio";
import { PROFESSION_LABEL_MAP } from "@/types/portfolio";

interface CaseStudyFormProps {
  caseStudy: CaseStudy | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

const PROFESSION_OPTIONS: ProfessionTemplate[] = [
  "dev",
  "design",
  "marketing",
  "consulting",
  "other",
];

export function CaseStudyForm({ caseStudy, onSave, onCancel }: CaseStudyFormProps) {
  const { t } = useI18n();

  const [title, setTitle] = useState(caseStudy?.title ?? "");
  const [clientName, setClientName] = useState(caseStudy?.clientName ?? "");
  const [professionTemplate, setProfessionTemplate] = useState<ProfessionTemplate>(
    (caseStudy?.professionTemplate as ProfessionTemplate) ?? "dev"
  );
  const [problem, setProblem] = useState(caseStudy?.problem ?? "");
  const [solution, setSolution] = useState(caseStudy?.solution ?? "");
  const [result, setResult] = useState(caseStudy?.result ?? "");
  const [metrics, setMetrics] = useState<Metric[]>(caseStudy?.metrics ?? []);
  const [coverImageUrl, setCoverImageUrl] = useState(caseStudy?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);

  const placeholderKey = (
    field: "problem" | "solution" | "result"
  ): string => {
    const cap =
      professionTemplate.charAt(0).toUpperCase() +
      professionTemplate.slice(1);
    return `${field}Placeholder${cap}`;
  };

  const addMetric = () => {
    setMetrics([...metrics, { label: "", value: "", unit: "" }]);
  };

  const updateMetric = (idx: number, field: keyof Metric, val: string) => {
    setMetrics(metrics.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
  };

  const removeMetric = (idx: number) => {
    setMetrics(metrics.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file, "case-studies");
    if (url) setCoverImageUrl(url);
    setUploading(false);
  };

  const handleSubmit = () => {
    onSave({
      title,
      clientName: clientName || undefined,
      professionTemplate,
      problem: problem || undefined,
      solution: solution || undefined,
      result: result || undefined,
      metrics: metrics.filter((m) => m.label && m.value),
      coverImageUrl: coverImageUrl || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {caseStudy ? t("editCaseStudy") : t("newCaseStudy")}
        </h1>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("caseStudiesTitle")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("clientName")}</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("professionTemplate")}</Label>
          <Select
            value={professionTemplate}
            onValueChange={(v) => setProfessionTemplate((v ?? "dev") as ProfessionTemplate)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROFESSION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {t(PROFESSION_LABEL_MAP[opt] as Parameters<typeof t>[0])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("problem")}</Label>
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            placeholder={t(placeholderKey("problem") as Parameters<typeof t>[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("solution")}</Label>
          <Textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={3}
            placeholder={t(placeholderKey("solution") as Parameters<typeof t>[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("result")}</Label>
          <Textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={3}
            placeholder={t(placeholderKey("result") as Parameters<typeof t>[0])}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{t("metrics")}</Label>
            <Button variant="outline" size="sm" onClick={addMetric} className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              {t("addMetric")}
            </Button>
          </div>
          {metrics.map((metric, idx) => (
            <div key={idx} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_80px_32px] gap-2 items-end">
              <Input
                placeholder={t("metricLabel")}
                value={metric.label}
                onChange={(e) => updateMetric(idx, "label", e.target.value)}
              />
              <Input
                placeholder={t("metricValue")}
                value={metric.value}
                onChange={(e) => updateMetric(idx, "value", e.target.value)}
              />
              <Input
                placeholder={t("metricUnit")}
                value={metric.unit}
                onChange={(e) => updateMetric(idx, "unit", e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeMetric(idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>{t("coverImage")}</Label>
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Cover"
              className="rounded-lg max-h-32 object-cover"
            />
          )}
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : t("coverImage")}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={!title.trim()}>
          {t("save")}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
