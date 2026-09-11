"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, BarChart3, FileText, FolderOpen, MessageSquare, Pencil, Users } from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();

  const features = [
    { icon: FileText, title: t("feature1Title"), description: t("feature1Desc") },
    { icon: BarChart3, title: t("feature3Title"), description: t("feature3Desc") },
    { icon: MessageSquare, title: t("feature4Title"), description: t("feature4Desc") },
  ];

  const steps = [
    { num: 1, icon: FolderOpen, title: t("step1Title"), desc: t("step1Desc") },
    { num: 2, icon: Pencil, title: t("step2Title"), desc: t("step2Desc") },
    { num: 3, icon: Users, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 md:py-36 lg:py-44">
        <div className="container text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in">
            {t("heroTitle1")}
            <br />
            <span className="text-primary">{t("heroTitle2")}</span>
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in break-keep"
            style={{ animationDelay: "0.1s" }}
          >
            {t("heroDesc")}
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/auth">
              <Button size="lg" className="rounded-lg text-base px-8 gap-2">
                {t("getStarted")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="rounded-lg text-base px-8">
                {t("viewDemo")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("featuresHeading1")} <span className="text-primary">{t("featuresHeading2")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto break-keep">{t("featuresDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/40 bg-card p-8 transition-all duration-200 hover:border-primary/30 hover:bg-card/80 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed break-keep">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-t border-border/40">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            {t("howItWorksHeading")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-border/60" />
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary/40 bg-card mb-6">
                  <span className="text-2xl font-bold text-primary">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm max-w-xs break-keep">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border/40">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("ctaTitle")}</h2>
          <p className="text-muted-foreground text-lg mb-8 break-keep">{t("ctaDesc")}</p>
          <Link href="/auth">
            <Button size="lg" className="rounded-lg text-base px-10 gap-2">
              {t("ctaButton")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
