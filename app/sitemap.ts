import type { MetadataRoute } from "next";
import { authorSlug, contentHref, getAllContent } from "@/lib/content";
import { canonicalUrl, isProduction } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction) return [];
  const content = getAllContent();
  const routes = [
    "",
    "changelog",
    "labs",
    ...new Set(
      content.map((item) => `category/${item.category.toLowerCase()}`),
    ),
    ...new Set(content.flatMap((item) => item.tags.map((tag) => `tag/${tag}`))),
    ...new Set(content.map((item) => `authors/${authorSlug(item.author)}`)),
  ];
  return [
    ...routes.map((route) => ({
      url: canonicalUrl(route),
      lastModified: new Date(
        Math.max(
          ...content.map((item) =>
            new Date(item.updated ?? item.date).getTime(),
          ),
        ),
      ),
    })),
    ...content.map((item) => ({
      url: canonicalUrl(contentHref(item)),
      lastModified: new Date(`${item.updated ?? item.date}T00:00:00Z`),
    })),
  ];
}
