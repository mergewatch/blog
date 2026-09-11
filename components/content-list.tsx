import Link from "next/link";
import { contentHref, type ContentItem } from "@/lib/content";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function ContentList({
  items,
  empty = "Nothing published here yet.",
}: {
  items: ContentItem[];
  empty?: string;
}) {
  if (!items.length) return <p className="text-fg-secondary">{empty}</p>;
  return (
    <ol className="max-w-3xl divide-y divide-border-subtle">
      {items.map((item) => (
        <li key={item.slug} className="py-6">
          <time
            dateTime={item.date}
            className="font-mono text-xs text-fg-tertiary"
          >
            {formatter.format(new Date(`${item.date}T00:00:00Z`))}
          </time>
          <h2 className="mt-2 text-xl font-bold tracking-tight">
            <Link
              href={contentHref(item)}
              className="transition hover:text-accent-green"
            >
              {item.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-6 text-fg-secondary">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
