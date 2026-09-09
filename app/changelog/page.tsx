import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PageHeading } from "@/components/page-heading";
import { getByType } from "@/lib/content";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: "MergeWatch product releases and improvements.",
  alternates: { canonical: canonicalUrl("changelog") },
};
export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHeading
        eyebrow="Ship log"
        title="Changelog"
        description="Product releases, review pipeline improvements, and operational changes."
      />
      <ContentList items={getByType("changelog")} />
    </div>
  );
}
