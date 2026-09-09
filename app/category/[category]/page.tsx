import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PageHeading } from "@/components/page-heading";
import { getAllContent } from "@/lib/content";
import { canonicalUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...new Set(getAllContent().map((item) => item.category.toLowerCase())),
  ].map((category) => ({ category }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const label = getAllContent().find(
    (item) => item.category.toLowerCase() === category,
  )?.category;
  return label
    ? {
        title: label,
        description: `MergeWatch articles filed under ${label}.`,
        alternates: { canonical: canonicalUrl(`category/${category}`) },
      }
    : {};
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const items = getAllContent().filter(
    (item) => item.category.toLowerCase() === category,
  );
  if (!items.length) notFound();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHeading
        eyebrow="Category"
        title={items[0].category}
        description={`Technical writing and updates filed under ${items[0].category}.`}
      />
      <ContentList items={items} />
    </div>
  );
}
