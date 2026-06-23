import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  translations,
  getClientT,
  type TranslationKey,
} from "@/lib/i18n-translations";

describe("translations ko/en parity", () => {
  it("ko and en have identical key sets (both directions)", () => {
    const koKeys = Object.keys(translations.ko).sort();
    const enKeys = Object.keys(translations.en).sort();

    // Every ko key exists in en.
    for (const key of koKeys) {
      expect(translations.en).toHaveProperty(key);
    }
    // Every en key exists in ko.
    for (const key of enKeys) {
      expect(translations.ko).toHaveProperty(key);
    }
    expect(koKeys).toEqual(enKeys);
  });
});

describe("getClientT", () => {
  const someKey = Object.keys(translations.ko)[0] as TranslationKey;

  it("returns the en string for getClientT('en')", () => {
    expect(getClientT("en")(someKey)).toBe(translations.en[someKey]);
  });

  it("returns the ko string for getClientT('ko')", () => {
    expect(getClientT("ko")(someKey)).toBe(translations.ko[someKey]);
  });

  it("returns the key itself for an unknown key", () => {
    const unknownKey = "__definitely_not_a_real_key__" as TranslationKey;
    expect(getClientT("en")(unknownKey)).toBe(unknownKey);
    expect(getClientT("ko")(unknownKey)).toBe(unknownKey);
  });
});

// ── resolveLocale: mock next/headers ────────────────
const cookieGet = vi.fn();
const headerGet = vi.fn();

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
  headers: vi.fn(async () => ({ get: headerGet })),
}));

describe("resolveLocale", () => {
  beforeEach(() => {
    cookieGet.mockReset();
    headerGet.mockReset();
  });

  it("returns the locale from the 'locale' cookie", async () => {
    cookieGet.mockImplementation((name: string) =>
      name === "locale" ? { value: "en" } : undefined
    );
    headerGet.mockReturnValue("");
    const { resolveLocale } = await import("@/lib/i18n-server");
    expect(await resolveLocale()).toBe("en");
  });

  it("falls back to Accept-Language when no cookie", async () => {
    cookieGet.mockReturnValue(undefined);
    headerGet.mockImplementation((name: string) =>
      name === "accept-language" ? "en-US,en;q=0.9" : null
    );
    const { resolveLocale } = await import("@/lib/i18n-server");
    expect(await resolveLocale()).toBe("en");
  });

  it("defaults to ko when no cookie and no accept-language", async () => {
    cookieGet.mockReturnValue(undefined);
    headerGet.mockReturnValue(null);
    const { resolveLocale } = await import("@/lib/i18n-server");
    expect(await resolveLocale()).toBe("ko");
  });
});
