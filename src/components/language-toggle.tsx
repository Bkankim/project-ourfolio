"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="rounded-lg px-3 font-medium text-xs tracking-wide"
    >
      {locale === "ko" ? "EN" : "KO"}
    </Button>
  );
}
