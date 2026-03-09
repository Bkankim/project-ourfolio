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
