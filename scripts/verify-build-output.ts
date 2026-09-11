/**
 * Assert on what the build actually EMITTED (#9).
 *
 * The two CI steps were named "verify canonical/index settings" and "verify
 * noindex settings" and ran only `pnpm build`. The setup was right — the
 * production build turns drafts ON to prove DEPLOYMENT_ENV excludes them
 * anyway — but nothing inspected the output, so if the guard broke both steps
 * would still pass while their names kept claiming otherwise.
 *
 * Usage: node --import tsx scripts/verify-build-output.ts production|staging
 */
import fs from "node:fs";
import path from "node:path";
import { getAllContent } from "../lib/content";
import { canonicalRoot } from "../lib/site";

const mode = process.argv[2];
if (mode !== "production" && mode !== "staging") {
  console.error("usage: verify-build-output.ts production|staging");
  process.exit(2);
}

const appDir = path.join(process.cwd(), ".next", "server", "app");
if (!fs.existsSync(appDir)) {
  console.error(
    `✗ CANNOT VERIFY — ${appDir} does not exist. Did the build run?`,
  );
  console.error("  This is not a pass.");
  process.exit(2);
}

const failures: string[] = [];
const checks: string[] = [];
const ok = (label: string) => checks.push(`✓ ${label}`);
const bad = (label: string, detail?: string) =>
  failures.push(`${label}${detail ? ` — ${detail}` : ""}`);

/** Read a file, or record why we could not and keep the structured output. */
function readOrFail(file: string, label: string): string | null {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (error) {
    bad(label, `could not read ${file}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Rendered HTML only. `.nft.json` file-trace manifests list every file a route
 * MIGHT read, including the whole content directory — so they mention draft
 * slugs legitimately. Grepping them would fail this check for a reason that
 * has nothing to do with what shipped.
 */
function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) htmlFiles(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const pages = htmlFiles(appDir);

// ── the build produced something ────────────────────────────────────────────
// An assertion that only proves ABSENCE passes when everything is absent.
if (pages.length < 5)
  bad(`only ${pages.length} rendered page(s) — build looks empty`);
else ok(`${pages.length} rendered pages`);

// Derived, not hardcoded. A fixed sentinel slug stops being meaningful the
// moment that article is renamed, and the canonical checks below depend on
// finding a real published page.
const publishedSlugs = getAllContent({ includeDrafts: false })
  .filter((item) => item.type === "posts")
  .map((item) => item.slug);
const published = pages.filter((f) =>
  publishedSlugs.some((slug) => path.basename(f) === `${slug}.html`),
);
if (!publishedSlugs.length)
  bad("no published posts in content/ — nothing to verify against");
else if (!published.length)
  bad(
    "no published post was emitted",
    `expected one of: ${publishedSlugs.join(", ")}`,
  );
else ok(`${published.length} published post(s) emitted`);

// ── drafts must never ship, whatever the preview flag says ──────────────────
// Slugs come from the app's own parser (gray-matter + zod), not a hand-rolled
// split. `---` is a markdown horizontal rule, so splitting a file on it
// misparses any post containing one — and a missed `draft: true` means that
// draft is never checked at all.
const drafts = getAllContent({ includeDrafts: true })
  .filter((item) => item.draft)
  .map((item) => item.slug);

if (!drafts.length) {
  // content/ ships a deliberate draft as a publication-safety fixture. With
  // none present these checks would pass vacuously and prove nothing.
  bad("no draft content found — the publication-safety fixture is missing");
} else {
  ok(
    `${drafts.length} draft slug(s) from the content parser: ${drafts.join(", ")}`,
  );

  // Exact filename, not substring: a draft slug that is a prefix of a
  // published one would otherwise condemn the published page.
  const draftPages = pages.filter((f) =>
    drafts.some((slug) => path.basename(f) === `${slug}.html`),
  );
  if (draftPages.length) bad("draft page emitted", draftPages.join(", "));
  else ok("no draft page emitted");

  // In HTML, match the slug as a complete URL path segment. A bare substring
  // search matches prose and unrelated slugs, and a false positive here is as
  // corrosive as a miss: it makes the check something people route around.
  const hrefFor = (slug: string) =>
    new RegExp(`/${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=["'/?#])`);
  const leaked = pages.filter((f) => {
    const body = readOrFail(f, "scanning rendered HTML for draft links");
    return body !== null && drafts.some((slug) => hrefFor(slug).test(body));
  });
  if (leaked.length)
    bad("draft link appears in rendered HTML", leaked.slice(0, 3).join(", "));
  else ok("no draft links in any rendered HTML");
}

// Match the canonical TAG, not merely the URL appearing somewhere. A page that
// links to another blog post contains that origin too, so a substring test
// would pass on a page carrying no canonical at all.
const CANONICAL =
  /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/mergewatch\.ai\/blog/i;

// ── environment-specific expectations ───────────────────────────────────────
// Only ever assert against a KNOWN published article. Falling back to pages[0]
// could land on _not-found.html and either produce a confusing second failure
// or pass on a page that proves nothing.
const sample = published[0] ?? null;
const html = sample ? readOrFail(sample, "reading the sample article") : null;

if (!html) {
  bad("no published article to check canonical/noindex against");
} else if (mode === "production") {
  if (!CANONICAL.test(html))
    bad(
      "no <link rel=canonical> pointing at https://mergewatch.ai/blog",
      sample!,
    );
  else ok("canonical points at the production origin");

  if (/noindex/i.test(html)) bad("production page carries noindex", sample!);
  else ok("no noindex on production output");
} else {
  if (!/noindex/i.test(html)) bad("staging page is missing noindex", sample!);
  else ok("staging output carries noindex");

  // Canonicals stay production-absolute even on staging — that is the design.
  if (!CANONICAL.test(html))
    bad("staging canonical does not point at the production origin", sample!);
  else ok("staging canonical still points at production");
}

// ── every advertised social image must actually resolve ─────────────────────
// #17: the file-convention image URL already carries basePath, and resolving it
// against a metadataBase that ALSO ended in /blog produced /blog/blog/... — a
// 404 on 17 pages including the homepage. layout.tsx set the correct URL by
// hand and the file convention silently overrode it, so the bug was invisible
// on a source read; only the emitted HTML showed it.
//
// So resolve what each page ADVERTISES to the artifact the build emitted, and
// require that artifact to be a real PNG. Pattern-matching the URL would only
// have caught the one doubling we already know about; this also catches a page
// that advertises nothing, and an image route that emitted an empty body.
const SOCIAL_IMAGE =
  /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

let resolved = 0;
for (const page of pages) {
  const body = readOrFail(page, "scanning rendered HTML for social images");
  if (body === null) continue;
  const label = path.relative(appDir, page);

  const urls = new Set([...body.matchAll(SOCIAL_IMAGE)].map((m) => m[1]));
  if (!urls.size) {
    bad("page advertises no social image", label);
    continue;
  }

  for (const url of urls) {
    if (!url.startsWith(`${canonicalRoot}/`)) {
      bad(
        "social image is not an absolute URL under the canonical root",
        `${label} -> ${url}`,
      );
      continue;
    }
    // Strip origin + basePath + cache-busting query to get the route path, then
    // map it to the emitted artifact. A doubled basePath leaves a leading
    // "/blog" here, which resolves to no route and fails below.
    const route = url.slice(canonicalRoot.length).replace(/\?.*$/, "");
    // A frontmatter `image` is served straight from public/ rather than
    // emitted by an image route, so accept either location.
    const artifact = [
      path.join(appDir, `${route}.body`),
      path.join(process.cwd(), "public", route),
    ].find((candidate) => fs.existsSync(candidate));
    if (!artifact) {
      bad("advertised social image was never emitted", `${label} -> ${url}`);
      continue;
    }
    const bytes = fs.readFileSync(artifact);
    if (!bytes.subarray(0, 4).equals(PNG_MAGIC)) {
      bad("emitted social image is not a PNG", `${label} -> ${url}`);
      continue;
    }
    resolved++;
  }
}
if (resolved)
  ok(`${resolved} advertised social image(s) resolve to emitted PNGs`);

for (const line of checks) console.log(`  ${line}`);
if (failures.length) {
  console.error(
    `\n✗ ${mode} build output failed ${failures.length} check(s):\n`,
  );
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\n✓ ${mode} build output verified.`);
