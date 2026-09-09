import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LogoMark size={16} /> MergeWatch
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-fg-secondary">
            Open-source AI pull request review. Technical notes from the people
            building it.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-secondary">
          <a href={site.product}>Home</a>
          <a href={site.pricing}>Pricing</a>
          <a href={site.docs}>Docs</a>
          <a href={site.github}>GitHub</a>
          <Link href="/rss.xml">RSS</Link>
        </div>
      </div>
    </footer>
  );
}
