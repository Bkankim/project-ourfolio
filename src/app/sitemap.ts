import type { MetadataRoute } from "next";

const BASE_URL = "https://outfolio.bkan.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/auth`, lastModified: new Date() },
  ];
}
