"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface HeroCtaProps {
  profileId: string;
  label: string;
}

export function HeroCta({ profileId, label }: HeroCtaProps) {
  const handleClick = () => {
    trackEvent(profileId, "cta_click");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button
      size="lg"
      className="rounded-xl"
      style={{ backgroundColor: "var(--portfolio-primary)" }}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
