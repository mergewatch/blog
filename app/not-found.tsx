import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <p className="font-mono text-sm text-accent-green">404 / NOT_FOUND</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight">
        This diff has no matching line.
      </h1>
      <p className="mt-5 text-fg-secondary">
        The page may have moved, or the link was never merged.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-accent-green px-5 py-2.5 text-sm font-semibold text-black"
      >
        Back to the blog
      </Link>
    </div>
  );
}
