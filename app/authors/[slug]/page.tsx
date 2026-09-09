import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentList } from "@/components/content-list";
import { PageHeading } from "@/components/page-heading";
import { authorSlug, getAllContent, getAuthors } from "@/lib/content";
import { canonicalUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return getAuthors().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthors().find((item) => item.slug === slug);
  return author
    ? {
        title: author.name,
        description: author.bio,
        alternates: { canonical: canonicalUrl(`authors/${slug}`) },
      }
    : {};
}
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthors().find((item) => item.slug === slug);
  if (!author) notFound();
  const items = getAllContent().filter(
    (item) => authorSlug(item.author) === slug,
  );
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <PageHeading
        eyebrow={author.role}
        title={author.name}
        description={author.bio}
      />
      <ContentList items={items} empty="No published articles yet." />
    </div>
  );
}
