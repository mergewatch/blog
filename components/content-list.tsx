import type { ContentItem } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export function ContentList({
  items,
  empty = "Nothing published here yet.",
}: {
  items: ContentItem[];
  empty?: string;
}) {
  if (!items.length)
    return (
      <p className="rounded-lg border border-border-default bg-surface-card p-8 text-fg-secondary">
        {empty}
      </p>
    );
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <PostCard key={`${item.type}/${item.slug}`} item={item} />
      ))}
    </div>
  );
}
