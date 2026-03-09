"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { FileText, FolderOpen, BarChart3, MessageSquare, ArrowRight, Star, CheckCircle } from "lucide-react";
import { FadeIn } from "@/components/fade-in";

export default function HomePage() {
  const { t } = useI18n();

  const features = [
    { icon: FileText, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: FolderOpen, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: BarChart3, title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: MessageSquare, title: t("feature4Title"), desc: t("feature4Desc") },
  ];

  const steps = [
    { num: "01", title: t("step1Title"), desc: t("step1Desc") },
    { num: "02", title: t("step2Title"), desc: t("step2Desc") },
    { num: "03", title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          {t("heroBadge")}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          {t("heroTitle1")}
          <br />
          <span className="text-primary">{t("heroTitle2")}</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t("heroDesc")}
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/auth">
            <Button size="lg" className="rounded-xl gap-2">
              {t("getStarted")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="rounded-xl">
              {t("viewDemo")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("featuresHeading1")}{" "}
              <span className="text-primary">{t("featuresHeading2")}</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              {t("featuresDesc")}
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <FadeIn key={f.title}>
                <div className="group rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">{t("howItWorksHeading")}</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <FadeIn key={s.num}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {s.num}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("socialProofHeading")}</h2>
            <p className="text-sm text-muted-foreground mb-8">
              <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />
              {t("socialProofCount")}
            </p>
            <blockquote className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 text-left">
              &ldquo;{t("testimonialQuote")}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {(t("testimonialAuthor") as string)[0]}
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{t("testimonialAuthor")}</p>
                <p className="text-xs text-muted-foreground">{t("testimonialRole")}</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 bg-primary/5">
        <div className="container mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground mb-8">{t("ctaDesc")}</p>
            <Link href="/auth">
              <Button size="lg" className="rounded-xl gap-2">
                {t("ctaButton")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
