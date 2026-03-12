"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg mb-3"
            >
              <img src="/logo-120.svg" alt="OurFolio" className="h-5 w-5" />
              <span>OurFolio</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("heroDesc").slice(0, 60)}…
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">
              {t("footerProduct")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footerFeatures")}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footerPricing")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">
              {t("footerCompany")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footerAbout")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  {t("footerContact")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          {t("footer")}
        </div>
      </div>
    </footer>
  );
}
