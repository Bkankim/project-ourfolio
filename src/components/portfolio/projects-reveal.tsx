"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProjectsRevealProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Thin client island: keeps the overflow project cards (server-rendered and
 * passed as children) hidden behind a "view all" button. No card-rendering
 * logic lives in the client bundle.
 */
export function ProjectsReveal({ label, children }: ProjectsRevealProps) {
  const [shown, setShown] = useState(false);

  if (shown) return <>{children}</>;

  return (
    <div className="text-center mt-6">
      <Button
        variant="outline"
        onClick={() => setShown(true)}
        className="rounded-xl"
      >
        {label}
      </Button>
    </div>
  );
}
