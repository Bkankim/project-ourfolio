/**
 * Lead/PII scrubbing for Sentry events. Pure and dependency-free so it can be
 * unit-tested in isolation and reused from every Sentry `beforeSend`.
 *
 * Removes contact-lead PII (sender name/email/message) wherever it can appear in
 * an event payload, plus auth headers/cookies and user identifiers. Mutates the
 * event in place and returns the same reference (so the caller's event type is
 * preserved for Sentry's beforeSend contract).
 */

const PII_KEYS = new Set([
  "senderName",
  "senderEmail",
  "message",
  "email",
  "name",
  "password",
  "token",
]);

interface SentryEventLike {
  request?: {
    data?: unknown;
    cookies?: unknown;
    headers?: Record<string, unknown>;
  } | null;
  user?: Record<string, unknown> | null;
  extra?: Record<string, unknown> | null;
  breadcrumbs?: Array<{ data?: Record<string, unknown> | null }> | null;
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = PII_KEYS.has(k) ? "[redacted]" : redact(v);
    }
    return out;
  }
  return value;
}

export function scrubPII<T extends object>(event: T): T {
  const e = event as SentryEventLike;

  if (e.request) {
    if (e.request.data !== undefined) {
      e.request.data = redact(e.request.data);
    }
    delete e.request.cookies;
    if (e.request.headers) {
      delete e.request.headers["authorization"];
      delete e.request.headers["Authorization"];
      delete e.request.headers["cookie"];
      delete e.request.headers["Cookie"];
    }
  }
  if (e.user) {
    delete e.user["email"];
    delete e.user["username"];
    delete e.user["ip_address"];
  }
  if (e.extra) {
    e.extra = redact(e.extra) as Record<string, unknown>;
  }
  if (Array.isArray(e.breadcrumbs)) {
    for (const crumb of e.breadcrumbs) {
      if (crumb && crumb.data) {
        crumb.data = redact(crumb.data) as Record<string, unknown>;
      }
    }
  }

  return event;
}
