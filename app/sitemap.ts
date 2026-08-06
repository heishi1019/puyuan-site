import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

/** Sitemap covering all three pages — GEO requirement (AGENTS.md §4).
 *  Served at /sitemap.xml, referenced from robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/proposalpilot`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/scholarpilot`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
