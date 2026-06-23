import type { MetadataRoute } from "next";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { isNotNull } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ourfolio.bkan.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root: MetadataRoute.Sitemap = [{ url: BASE_URL, lastModified: new Date() }];

  try {
    const rows = await db
      .select({ username: profiles.username, updatedAt: profiles.updatedAt })
      .from(profiles)
      .where(isNotNull(profiles.username));

    const profileUrls = rows
      .filter((r): r is { username: string; updatedAt: Date } => Boolean(r.username))
      .map((r) => ({
        url: `${BASE_URL}/${r.username}`,
        lastModified: r.updatedAt ?? new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...root, ...profileUrls];
  } catch {
    // Never fail the sitemap build on a transient DB error.
    return root;
  }
}
