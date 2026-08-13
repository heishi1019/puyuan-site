import type { MetadataRoute } from "next";
import { PROPOSAL_SITE_URL, SCHOLAR_SITE_URL, SITE_URL } from "@/lib/schema";

/** Sitemap covering all public pages and product entities.
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
      url: PROPOSAL_SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: SCHOLAR_SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
