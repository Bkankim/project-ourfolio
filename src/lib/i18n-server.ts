import { cookies, headers } from "next/headers";
import { getClientT, type Locale } from "./i18n-translations";

const LOCALES: readonly Locale[] = ["ko", "en"];
export const DEFAULT_LOCALE: Locale = "ko";

/**
 * Resolve the request locale from the persisted cookie, then Accept-Language,
 * else the default (ko). Server-only (uses next/headers).
 */
export async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("locale")?.value;
  if (fromCookie && LOCALES.includes(fromCookie as Locale)) {
    return fromCookie as Locale;
  }

  const h = await headers();
  const accept = (h.get("accept-language") ?? "").toLowerCase();
  if (accept) {
    const enIdx = accept.indexOf("en");
    const koIdx = accept.indexOf("ko");
    if (enIdx >= 0 && (koIdx < 0 || enIdx < koIdx)) return "en";
  }
  return DEFAULT_LOCALE;
}

/** Synchronous translator for a known locale. Mirrors the client useI18n t(). */
export function getT(locale: Locale) {
  return getClientT(locale);
}
