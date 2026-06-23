"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

/** Client island that fires a single page-view beacon on mount. */
export function PageViewBeacon({ profileId }: { profileId: string }) {
  useEffect(() => {
    trackPageView(profileId);
  }, [profileId]);

  return null;
}
