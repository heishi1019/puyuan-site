import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

/** robots.txt — served at /robots.txt.
 *
 *  GEO note: AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Bytespider, etc.)
 *  are intentionally NOT blocked. Being crawlable by generative engines is the
 *  point of GEO — blocking them would defeat the whole strategy (AGENTS.md §4).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
