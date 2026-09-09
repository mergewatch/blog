import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePage } from "@/components/article-page";
import { getByType, getContent } from "@/lib/content";
import { itemMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return getByType("changelog").map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getContent("changelog", slug);
  return item ? itemMetadata(item) : {};
}
export default async function ChangelogEntry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContent("changelog", slug);
  if (!item) notFound();
  return <ArticlePage item={item} />;
}
