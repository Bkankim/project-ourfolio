"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
      <p className="text-sm text-muted-foreground">
        잠시 후 다시 시도해주세요.
      </p>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  );
}
