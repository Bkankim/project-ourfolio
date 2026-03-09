"use client";

import { useFadeIn } from "@/hooks/use-fade-in";

export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
