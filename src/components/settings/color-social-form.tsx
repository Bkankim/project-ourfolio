"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import type { SocialLinks } from "@/types/portfolio";

interface ColorSocialFormProps {
  primaryColor: string;
  setPrimaryColor: (v: string) => void;
  accentColor: string;
  setAccentColor: (v: string) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (v: SocialLinks) => void;
}

const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/..." },
  { key: "website", label: "website", placeholder: "https://..." },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/..." },
  { key: "behance", label: "Behance", placeholder: "https://behance.net/..." },
] as const;

export function ColorSocialForm({
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  socialLinks,
  setSocialLinks,
}: ColorSocialFormProps) {
  const { t } = useI18n();

  const updateSocialLink = (key: keyof SocialLinks, value: string) => {
    setSocialLinks({ ...socialLinks, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("primaryColor")} / {t("accentColor")}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("primaryColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("accentColor")}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer"
              />
              <Input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("socialLinksSection")}</h2>
        <div className="grid gap-3">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label className="text-xs">{field.key === "website" ? t("website") : field.label}</Label>
              <Input
                value={(socialLinks[field.key as keyof SocialLinks]) ?? ""}
                onChange={(e) => updateSocialLink(field.key as keyof SocialLinks, e.target.value)}
                placeholder={field.placeholder}
                type="url"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
