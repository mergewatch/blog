import type { Metadata } from "next";
import type { ContentItem } from "@/lib/content";
import { canonicalUrl, isProduction, site } from "@/lib/site";
import { contentHref } from "@/lib/content";

export const robotsMetadata: Metadata["robots"] = isProduction
  ? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    }
  : {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    };

export function itemMetadata(item: ContentItem): Metadata {
  const url = item.canonical ?? canonicalUrl(contentHref(item));
  const image = item.image
    ? canonicalUrl(item.image.replace(/^\//, ""))
    : canonicalUrl(`og/${item.type}/${item.slug}`);
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: url },
    robots: robotsMetadata,
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: item.title,
      description: item.description,
      publishedTime: item.date,
      modifiedTime: item.updated ?? item.date,
      authors: [item.author],
      tags: item.tags,
      images: [{ url: image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [image],
    },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
