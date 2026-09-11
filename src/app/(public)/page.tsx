"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Github,
  Mail,
  MessageSquare,
} from "lucide-react";

// 랜딩의 목업과 서술은 실제 스키마·시드 데이터 범위 안에서만 쓴다.
// 완성도 점수는 사진·소개·프로젝트 3개·소셜 링크 4항목(dashboard/portfolio-score.tsx),
// 문의 유형은 채용·협업·기타(leads.inquiryType). 예산 범위 같은 없는 필드는 적지 않는다.

const SCORE = 75;
const RADIUS = 26;
const CIRC = 2 * Math.PI * RADIUS;

export default function HomePage() {
  const { t } = useI18n();

  const proofs = [
    { icon: FileText, title: t("lpProof1Title"), body: t("lpProof1Body") },
    { icon: BarChart3, title: t("lpProof2Title"), body: t("lpProof2Body") },
    { icon: MessageSquare, title: t("lpProof3Title"), body: t("lpProof3Body") },
  ];

  const steps = [
    { n: "01", title: t("lpStep1T"), body: t("lpStep1B") },
    { n: "02", title: t("lpStep2T"), body: t("lpStep2B") },
    { n: "03", title: t("lpStep3T"), body: t("lpStep3B") },
  ];

  const facts = [
    { title: t("lpFact1T"), body: t("lpFact1B") },
    { title: t("lpFact2T"), body: t("lpFact2B") },
    { title: t("lpFact3T"), body: t("lpFact3B") },
    { title: t("lpFact4T"), body: t("lpFact4B") },
  ];

  return (
    <div className="flex flex-col break-keep">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_85%_15%,hsl(var(--primary)/0.18)_0%,transparent_70%)]"
        />
        <div className="container max-w-6xl mx-auto grid gap-14 pt-16 pb-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-24 md:pb-28">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("lpEyebrow")}
            </p>
            <h1 className="text-[clamp(2.4rem,5.4vw,4.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
              {t("lpTitle1")}
              <br />
              <span className="text-primary">{t("lpTitle2")}</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {t("lpLead")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/auth">
                <Button size="lg" className="rounded-lg text-sm px-6 gap-2 h-11">
                  {t("getStarted")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="rounded-lg text-sm px-6 h-11">
                  {t("viewDemo")}
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{t("lpNote")}</p>
          </div>

          {/* Product mockup: public profile card + score + inquiry */}
          <div className="relative mx-auto mt-6 mb-8 w-full max-w-md md:my-0 md:max-w-none">
            <div className="rounded-2xl border border-border/60 bg-card p-5 pb-10 md:pb-5 shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.6)]">
              <p className="mb-4 pr-32 md:pr-0 text-[11px] font-medium tracking-[0.08em] text-muted-foreground">
                {t("lpMockProfile")} · ourfolio.bkan.dev/demo
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30">
                  DD
                </div>
                <div>
                  <p className="font-semibold leading-tight">{t("lpMockName")}</p>
                  <p className="text-xs text-muted-foreground">{t("lpMockRole")}</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-sm font-semibold">{t("lpMockProject")}</p>
                <dl className="mt-3 space-y-2 text-xs">
                  <div className="grid grid-cols-[3.2rem_1fr] gap-2">
                    <dt className="text-muted-foreground">{t("lpMockProblem")}</dt>
                    <dd>{t("lpMockProblemText")}</dd>
                  </div>
                  <div className="grid grid-cols-[3.2rem_1fr] gap-2">
                    <dt className="text-muted-foreground">{t("lpMockSolution")}</dt>
                    <dd>{t("lpMockSolutionText")}</dd>
                  </div>
                  <div className="grid grid-cols-[3.2rem_1fr] gap-2 rounded-md bg-accent/15 px-2 py-1.5 -mx-2">
                    <dt className="font-medium text-accent">{t("lpMockResult")}</dt>
                    <dd className="font-semibold">{t("lpMockResultText")}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Score chip */}
            <div className="absolute -right-3 -top-6 flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-lg md:-right-6">
              <svg className="h-14 w-14 -rotate-90" viewBox="0 0 64 64" aria-hidden>
                <circle cx="32" cy="32" r={RADIUS} fill="none" className="stroke-muted" strokeWidth="6" />
                <circle
                  cx="32"
                  cy="32"
                  r={RADIUS}
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - (SCORE / 100) * CIRC}
                  className="stroke-accent"
                />
              </svg>
              <div>
                <p className="text-[11px] text-muted-foreground">{t("lpMockScore")}</p>
                <p className="text-xl font-bold leading-tight">{SCORE}%</p>
                <p className="text-[11px] text-muted-foreground">{t("lpMockScoreMissing")}</p>
              </div>
            </div>

            {/* Inquiry chip */}
            <div className="absolute -bottom-7 -left-3 flex max-w-[78%] items-start gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-lg md:-left-8">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold">{t("lpMockLead")}</p>
                <p className="truncate text-xs text-muted-foreground">{t("lpMockLeadText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof devices */}
      <section id="features" className="border-t border-border/40">
        <div className="container max-w-6xl mx-auto py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_2.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">{t("lpProofLabel")}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{t("lpProofTitle")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("lpProofDesc")}</p>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3">
              {proofs.map((p, i) => (
                <li key={p.title}>
                  <p className="text-5xl font-extrabold tracking-tighter text-primary/25">0{i + 1}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <p.icon className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container max-w-6xl mx-auto py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_2.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">{t("lpStepsLabel")}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{t("lpStepsTitle")}</h2>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="rounded-xl border border-border/60 bg-card p-5">
                  <p className="text-xs font-mono text-muted-foreground">{s.n}</p>
                  <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Facts band (tone flip) */}
      <section className="bg-foreground text-background">
        <div className="container max-w-6xl mx-auto grid gap-10 py-20 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">{t("lpFactsLabel")}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t("lpFactsTitle")}</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-background/75 md:text-[15px]">{t("lpFactsBody")}</p>
            <p className="mt-5 font-mono text-xs text-background/60">Next.js 16 · Neon Postgres · Drizzle · Cloudflare R2 · Resend · Vercel icn1</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <a
                href="https://github.com/Bkankim/project-ourfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline decoration-background/40 underline-offset-4 hover:decoration-background"
              >
                <Github className="h-3.5 w-3.5" /> {t("lpFactsSource")}
              </a>
              <a
                href="https://blog.bkan.dev/stopping-is-not-impulse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 underline decoration-background/40 underline-offset-4 hover:decoration-background"
              >
                {t("lpFactsWhy")} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <dl className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.title} className="border-l-2 border-primary/60 pl-4">
                <dt className="flex items-center gap-2 text-sm font-semibold">
                  <Check className="h-3.5 w-3.5 text-primary" /> {f.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-background/70">{f.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40">
        <div className="container max-w-3xl mx-auto py-20 text-center md:py-24">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("lpCtaTitle")}</h2>
          <p className="mt-4 text-muted-foreground">{t("lpCtaBody")}</p>
          <Link href="/auth" className="mt-8 inline-block">
            <Button size="lg" className="rounded-lg text-sm px-8 gap-2 h-11">
              {t("ctaButton")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
