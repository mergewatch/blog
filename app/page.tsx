import { ContentList } from "@/components/content-list";
import { getByType } from "@/lib/content";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="sr-only">{site.name}</h1>
      <p className="text-fg-secondary">{site.description}</p>
      <div className="mt-8 border-t border-border-subtle">
        <ContentList items={getByType("posts")} />
      </div>
    </div>
  );
}
