import { NextResponse, type NextRequest } from "next/server";

const windowMap = new Map<string, number[]>();
const MAX_KEYS = 10_000;

/**
 * In-memory sliding window rate limiter.
 * Resets on serverless cold start — acceptable for MVP.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = windowMap.get(key) ?? [];

  // Remove expired entries
  const valid = timestamps.filter((t) => now - t < windowMs);

  // Evict oldest keys when map grows too large
  if (windowMap.size >= MAX_KEYS) {
    const first = windowMap.keys().next().value!;
    windowMap.delete(first);
  }

  if (valid.length >= limit) {
    windowMap.set(key, valid);
    return { success: false, remaining: 0 };
  }

  valid.push(now);
  windowMap.set(key, valid);
  return { success: true, remaining: limit - valid.length };
}

/** Standard 429 response for rate-limited requests. */
export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}

/** Extract client IP from request headers. */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
