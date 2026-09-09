import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PageHeading } from "@/components/page-heading";
import { getAllContent } from "@/lib/content";
import { canonicalUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...new Set(getAllContent().flatMap((item) => item.tags))].map(
    (tag) => ({ tag }),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `MergeWatch articles tagged ${tag}.`,
    alternates: { canonical: canonicalUrl(`tag/${tag}`) },
  };
}
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const items = getAllContent().filter((item) => item.tags.includes(tag));
  if (!items.length) notFound();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHeading
        eyebrow="Tag"
        title={`#${tag}`}
        description={`Notes connected by ${tag}.`}
      />
      <ContentList items={items} />
    </div>
  );
}
