import Link from "next/link";
import { ArrowRight, FlaskConical, TerminalSquare } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getAllContent, getByType } from "@/lib/content";

export default function HomePage() {
  const all = getAllContent();
  const posts = getByType("posts");
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts
    .filter((post) => post.slug !== featured?.slug)
    .slice(0, 4);
  const changelog = getByType("changelog").slice(0, 2);
  const labs = getByType("labs").slice(0, 2);
  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div
          className="technical-grid absolute inset-0 opacity-50"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-green">
            <TerminalSquare size={14} /> Notes from the review loop
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[1.03] tracking-[-0.04em] md:text-7xl">
            Building trust into every pull request.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary">
            Engineering articles, product updates, and research from the team
            building open-source AI code review.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="rounded-full border border-border-default bg-surface-page px-3 py-1.5 text-xs text-fg-secondary transition hover:border-accent-green hover:text-fg-primary"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-14">
        {featured && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-secondary">
                Featured
              </h2>
              <span className="font-mono text-xs text-fg-tertiary">
                {all.length.toString().padStart(2, "0")} published notes
              </span>
            </div>
            <PostCard item={featured} featured />
          </section>
        )}

        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
                Latest
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                From the team
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {latest.map((post) => (
              <PostCard key={post.slug} item={post} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-border-subtle py-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
              Product
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              What changed
            </h2>
            <p className="mt-3 text-sm leading-6 text-fg-secondary">
              Release notes without the release-note fog.
            </p>
            <Link
              href="/changelog"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-fg-primary"
            >
              All updates <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {changelog.map((item) => (
              <PostCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-surface-subtle p-2 text-accent-green">
              <FlaskConical size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
                MergeWatch Labs
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                Research in the open
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {labs.map((item) => (
              <PostCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
