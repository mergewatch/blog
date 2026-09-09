import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PageHeading } from "@/components/page-heading";
import { getByType } from "@/lib/content";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "MergeWatch Labs",
  description: "Experiments and research on AI-assisted code review.",
  alternates: { canonical: canonicalUrl("labs") },
};
export default function LabsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHeading
        eyebrow="Research in the open"
        title="MergeWatch Labs"
        description="Experiments, measurements, and working notes on how machines can help humans review code."
      />
      <ContentList items={getByType("labs")} />
    </div>
  );
}
