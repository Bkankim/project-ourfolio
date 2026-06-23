"use client";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("ourfolio_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ourfolio_visitor_id", id);
  }
  return id;
}

export function trackEvent(
  profileId: string,
  eventType: "page_view" | "cta_click" | "contact_submit",
  metadata?: Record<string, unknown>
): void {
  const visitorId = getVisitorId();

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId, eventType, visitorId, metadata }),
  }).catch(() => {});
}

/**
 * Fire-and-forget page-view beacon. Prefers navigator.sendBeacon so the event
 * survives navigation/tab-close, falling back to a keepalive fetch.
 */
export function trackPageView(profileId: string): void {
  const visitorId = getVisitorId();
  const body = JSON.stringify({ profileId, eventType: "page_view", visitorId });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics/track", blob)) return;
  }

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
