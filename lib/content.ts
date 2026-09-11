import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

export const contentTypes = ["posts"] as const;
export type ContentType = (typeof contentTypes)[number];
export const categories = [
  "Company",
  "Engineering",
  "Product",
  "Research",
] as const;

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(20),
  date: z.string().date(),
  updated: z.string().date().optional(),
  author: z.string().min(1),
  category: z.enum(categories),
  tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
  draft: z.boolean().default(false),
  canonical: z.string().url().optional(),
  image: z.string().startsWith("/").optional(),
  related: z.array(z.string()).optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type ContentItem = Frontmatter & {
  slug: string;
  type: ContentType;
  body: string;
  readingTime: string;
};

const contentRoot = path.join(process.cwd(), "content");

function showDrafts() {
  return (
    process.env.DEPLOYMENT_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true"
  );
}

export function parseContentFile(
  type: ContentType,
  filePath: string,
): ContentItem {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    throw new Error(
      `${path.relative(process.cwd(), filePath)}: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  const slug = path.basename(filePath).replace(/\.mdx?$/, "");
  return {
    ...result.data,
    slug,
    type,
    body: parsed.content,
    readingTime: readingTime(parsed.content).text,
  };
}

export function getAllContent(
  options: { includeDrafts?: boolean } = {},
): ContentItem[] {
  const items = contentTypes.flatMap((type) => {
    const directory = path.join(contentRoot, type);
    if (!fs.existsSync(directory)) return [];
    return fs
      .readdirSync(directory)
      .filter((name) => /\.mdx?$/.test(name))
      .map((name) => parseContentFile(type, path.join(directory, name)));
  });
  const includeDrafts = options.includeDrafts ?? showDrafts();
  return items
    .filter((item) => includeDrafts || !item.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getContent(type: ContentType, slug: string) {
  return getAllContent().find(
    (item) => item.type === type && item.slug === slug,
  );
}

export function getByType(type: ContentType) {
  return getAllContent().filter((item) => item.type === type);
}

export function contentHref(item: Pick<ContentItem, "slug">) {
  return `/${item.slug}`;
}

export function getRelated(item: ContentItem, limit = 3) {
  const all = getAllContent().filter(
    (candidate) => candidate.slug !== item.slug,
  );
  const explicit = (item.related ?? []).flatMap((slug) =>
    all.filter((candidate) => candidate.slug === slug),
  );
  const inferred = all
    .filter((candidate) => !explicit.includes(candidate))
    .map((candidate) => ({
      candidate,
      score:
        candidate.tags.filter((tag) => item.tags.includes(tag)).length +
        (candidate.category === item.category ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ candidate }) => candidate);
  return [...explicit, ...inferred].slice(0, limit);
}

export function getAdjacentPost(item: ContentItem) {
  const posts = getByType(item.type);
  const index = posts.findIndex((candidate) => candidate.slug === item.slug);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function validateAllContent() {
  const items = getAllContent({ includeDrafts: true });
  const seen = new Map<string, string>();
  const seenSlugs = new Map<string, string>();
  const errors: string[] = [];
  for (const item of items) {
    const publicPath = contentHref(item);
    if (seen.has(publicPath))
      errors.push(
        `Duplicate public slug ${publicPath}: ${seen.get(publicPath)} and ${item.type}/${item.slug}`,
      );
    seen.set(publicPath, `${item.type}/${item.slug}`);
    if (seenSlugs.has(item.slug))
      errors.push(
        `Duplicate slug '${item.slug}': ${seenSlugs.get(item.slug)} and ${item.type}/${item.slug}`,
      );
    seenSlugs.set(item.slug, `${item.type}/${item.slug}`);
    if (item.updated && item.updated < item.date)
      errors.push(
        `${item.type}/${item.slug}: updated date precedes publication date`,
      );
    if (
      item.canonical &&
      !item.canonical.startsWith("https://mergewatch.ai/blog/")
    )
      errors.push(
        `${item.type}/${item.slug}: canonical override must stay under https://mergewatch.ai/blog/`,
      );
    if (item.image) {
      const image = path.join(
        process.cwd(),
        "public",
        item.image.replace(/^\//, ""),
      );
      if (!fs.existsSync(image))
        errors.push(
          `${item.type}/${item.slug}: image not found at public${item.image}`,
        );
    }
    for (const slug of item.related ?? []) {
      if (!items.some((candidate) => candidate.slug === slug))
        errors.push(
          `${item.type}/${item.slug}: related content '${slug}' does not exist`,
        );
    }
    for (const [, bang, target] of item.body.matchAll(
      /(!?)\[[^\]]*\]\((\/[^)\s]+)\)/g,
    )) {
      // Image embeds point at files in public/, not at content pages.
      if (bang) {
        const file = path.join(process.cwd(), "public", target.slice(1));
        if (!fs.existsSync(file))
          errors.push(
            `${item.type}/${item.slug}: image not found at public${target}`,
          );
        continue;
      }
      const link = target.split("#")[0].replace(/\/$/, "");
      if (
        !link ||
        link === "/" ||
        link.startsWith("/category/") ||
        link.startsWith("/tag/") ||
        link.startsWith("/authors/")
      )
        continue;
      if (!items.some((candidate) => contentHref(candidate) === link))
        errors.push(`${item.type}/${item.slug}: broken internal link ${link}`);
    }
  }
  const authors = getAuthors();
  for (const item of items)
    if (!authors.some((author) => author.name === item.author))
      errors.push(
        `${item.type}/${item.slug}: author '${item.author}' has no content/authors profile`,
      );
  return { items, errors };
}

const authorSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(20),
  github: z.string().url().optional(),
  image: z.string().startsWith("/").optional(),
  // Drives the schema.org author type in article JSON-LD.
  kind: z.enum(["person", "organization"]).default("person"),
});
export type Author = z.infer<typeof authorSchema> & { slug: string };

export function getAuthors(): Author[] {
  const directory = path.join(contentRoot, "authors");
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((name) => /\.mdx?$/.test(name))
    .map((name) => {
      const parsed = matter(
        fs.readFileSync(path.join(directory, name), "utf8"),
      );
      const data = authorSchema.parse(parsed.data);
      return { ...data, slug: name.replace(/\.mdx?$/, "") };
    });
}

export function authorSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
