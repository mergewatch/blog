import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { ContentList } from "@/components/content-list";
import { Markdown } from "@/components/markdown";
import {
  authorSlug,
  contentHref,
  getAdjacentPost,
  getAuthors,
  getRelated,
  type ContentItem,
} from "@/lib/content";
import { canonicalUrl } from "@/lib/site";
import { serializeJsonLd } from "@/lib/metadata";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function ArticlePage({ item }: { item: ContentItem }) {
  const related = getRelated(item);
  const adjacent = getAdjacentPost(item);
  const url = item.canonical ?? canonicalUrl(contentHref(item));
  const author = getAuthors().find(({ name }) => name === item.author);
  const crumbs = [
    { name: "Blog", url: canonicalUrl() },
    { name: item.title, url },
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: item.title,
      description: item.description,
      datePublished: item.date,
      dateModified: item.updated ?? item.date,
      mainEntityOfPage: url,
      author: {
        "@type": author?.kind === "organization" ? "Organization" : "Person",
        name: item.author,
        url: canonicalUrl(`/authors/${authorSlug(item.author)}`),
      },
      publisher: { "@id": "https://mergewatch.ai/#organization" },
      keywords: item.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
  ];

  return (
    <>
      <article>
        <header className="border-b border-border-subtle">
          <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-fg-secondary hover:text-fg-primary"
            >
              <ArrowLeft size={15} /> All articles
            </Link>
            <div className="mt-10 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-green">
              <span>{item.category}</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] md:text-6xl">
              {item.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-fg-secondary">
              {item.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-secondary">
              <Link
                href={`/authors/${authorSlug(item.author)}`}
                className="font-medium text-fg-primary hover:text-accent-green"
              >
                {item.author}
              </Link>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} />
                <time dateTime={item.date}>
                  {dateFormatter.format(new Date(`${item.date}T00:00:00Z`))}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={15} />
                {item.readingTime}
              </span>
              {item.updated && item.updated !== item.date && (
                <span>
                  Updated{" "}
                  {dateFormatter.format(new Date(`${item.updated}T00:00:00Z`))}
                </span>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[minmax(0,48rem)_12rem] lg:justify-center">
          <Markdown>{item.body}</Markdown>
          <aside className="order-first lg:order-last">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-tertiary">
                Filed under
              </p>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="rounded-full border border-border-default px-2.5 py-1 text-xs text-fg-secondary hover:border-accent-green"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
      {(adjacent.older || adjacent.newer) && (
        <nav
          className="mx-auto grid max-w-4xl gap-4 border-t border-border-subtle px-5 py-10 sm:grid-cols-2"
          aria-label="Adjacent articles"
        >
          {adjacent.older ? (
            <Link
              href={contentHref(adjacent.older)}
              className="rounded-lg border border-border-default p-4 text-sm"
            >
              <span className="text-xs text-fg-tertiary">Older</span>
              <span className="mt-1 flex items-center gap-2 font-semibold">
                <ArrowLeft size={14} />
                {adjacent.older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {adjacent.newer && (
            <Link
              href={contentHref(adjacent.newer)}
              className="rounded-lg border border-border-default p-4 text-right text-sm"
            >
              <span className="text-xs text-fg-tertiary">Newer</span>
              <span className="mt-1 flex items-center justify-end gap-2 font-semibold">
                {adjacent.newer.title}
                <ArrowRight size={14} />
              </span>
            </Link>
          )}
        </nav>
      )}
      {related.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-12">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Keep reading
          </h2>
          <ContentList items={related} />
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </>
  );
}
