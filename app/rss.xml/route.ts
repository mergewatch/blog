import { contentHref, getAllContent } from "@/lib/content";
import { canonicalRoot, canonicalUrl } from "@/lib/site";

function escapeXml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character]!,
  );
}

export function GET() {
  const items = getAllContent();
  const xml = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>MergeWatch Blog</title><link>${canonicalRoot}</link><description>Technical notes, product updates, and research from MergeWatch.</description><language>en-us</language><atom:link href="${canonicalUrl("rss.xml")}" rel="self" type="application/rss+xml"/>${items.map((item) => `<item><title>${escapeXml(item.title)}</title><link>${canonicalUrl(contentHref(item))}</link><guid isPermaLink="true">${canonicalUrl(contentHref(item))}</guid><description>${escapeXml(item.description)}</description><pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate><author>team@mergewatch.ai (${escapeXml(item.author)})</author><category>${escapeXml(item.category)}</category></item>`).join("")}</channel></rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
