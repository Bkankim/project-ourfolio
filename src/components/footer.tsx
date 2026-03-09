"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-lg tracking-tight">
              OurFolio
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("heroDesc").slice(0, 60)}...
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">{t("footerProduct")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footerFeatures")}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footerPricing")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">{t("footerCompany")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footerAbout")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("footerContact")}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1" />
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          {t("footer")}
        </div>
      </div>
    </footer>
  );
}
