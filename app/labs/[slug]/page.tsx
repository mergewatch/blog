import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePage } from "@/components/article-page";
import { getByType, getContent } from "@/lib/content";
import { itemMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return getByType("labs").map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getContent("labs", slug);
  return item ? itemMetadata(item) : {};
}
export default async function LabsEntry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContent("labs", slug);
  if (!item) notFound();
  return <ArticlePage item={item} />;
}
