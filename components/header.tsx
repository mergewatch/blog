import { Github } from "lucide-react";
import Link from "next/link";
import { Wordmark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="bg-surface-page/90 sticky top-0 z-40 border-b border-border-subtle backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
        aria-label="Main navigation"
      >
        <Wordmark />
        <div className="flex items-center gap-4 text-sm text-fg-secondary">
          <a
            href={site.product}
            className="hidden transition hover:text-fg-primary md:inline"
          >
            Product
          </a>
          <a
            href={site.pricing}
            className="hidden transition hover:text-fg-primary md:inline"
          >
            Pricing
          </a>
          <a
            href={site.docs}
            className="hidden transition hover:text-fg-primary sm:inline"
          >
            Docs
          </a>
          <Link
            href="/changelog"
            className="hidden transition hover:text-fg-primary lg:inline"
          >
            Changelog
          </Link>
          <Link
            href="/labs"
            className="hidden transition hover:text-fg-primary lg:inline"
          >
            Labs
          </Link>
          <a
            href={site.github}
            aria-label="MergeWatch on GitHub"
            className="transition hover:text-fg-primary"
          >
            <Github size={19} />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
