import { Github } from "lucide-react";
import { Wordmark } from "@/components/logo";
import { site } from "@/lib/site";

// Mirrors the mergewatch.ai marketing nav
// (mergewatch.ai: packages/dashboard/app/page.tsx).
const linkClass =
  "hidden text-sm text-primer-muted transition hover:text-fg-primary sm:inline";

export function Header() {
  return (
    <header>
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-12"
        aria-label="Main navigation"
      >
        <Wordmark />
        <div className="flex items-center gap-4">
          <a
            href={site.docs}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Docs
          </a>
          <a href={site.pricing} className={linkClass}>
            Pricing
          </a>
          <a href={site.openSource} className={linkClass}>
            For Open Source
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-primer-muted transition hover:text-fg-primary sm:inline"
            aria-label="GitHub repository"
          >
            <Github size={20} />
          </a>
          <a
            href={site.signin}
            className="inline-flex items-center rounded-lg bg-primer-green px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Get started
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
