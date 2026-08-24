import type { MetadataRoute } from "next";
import { publicSiteUrl } from "../lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const base = publicSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/dashboard", "/today", "/compare"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
