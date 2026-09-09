import type { MetadataRoute } from "next";
import { canonicalRoot, isProduction } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${canonicalRoot}/sitemap.xml`,
    host: "https://mergewatch.ai",
  };
}
