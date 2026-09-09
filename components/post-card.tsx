import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { contentHref } from "@/lib/content";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function PostCard({
  item,
  featured = false,
}: {
  item: ContentItem;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border border-border-default bg-surface-card transition hover:border-fg-tertiary hover:bg-surface-card-hover ${featured ? "p-7 md:p-9" : "p-6"}`}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-secondary">
        <span className="text-accent-green">
          {item.type === "posts" ? item.category : item.type}
        </span>
        <span>·</span>
        <time dateTime={item.date}>
          {formatter.format(new Date(`${item.date}T00:00:00Z`))}
        </time>
      </div>
      <h3
        className={`${featured ? "mt-5 text-3xl md:text-4xl" : "mt-4 text-xl"} font-bold leading-tight tracking-tight text-fg-primary`}
      >
        <Link href={contentHref(item)} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      <p
        className={`${featured ? "mt-4 max-w-2xl text-base" : "mt-3 text-sm"} leading-7 text-fg-secondary`}
      >
        {item.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-7 text-xs text-fg-tertiary">
        <span>
          {item.author} · {item.readingTime}
        </span>
        <ArrowUpRight
          size={16}
          className="text-accent-green transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </article>
  );
}
