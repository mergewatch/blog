#!/usr/bin/env node
/**
 * Assert on what the build actually EMITTED (#9).
 *
 * The two CI steps were named "verify canonical/index settings" and "verify
 * noindex settings" and ran only `pnpm build`. The setup was right — the
 * production build turns drafts ON to prove DEPLOYMENT_ENV excludes them
 * anyway — but nothing inspected the output, so if the guard broke both steps
 * would still pass while their names kept claiming otherwise.
 *
 * Usage: node scripts/verify-build-output.mjs production|staging
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv[2];
if (mode !== "production" && mode !== "staging") {
  console.error("usage: verify-build-output.mjs production|staging");
  process.exit(2);
}

const appDir = join(process.cwd(), ".next", "server", "app");
if (!existsSync(appDir)) {
  console.error(
    `✗ CANNOT VERIFY — ${appDir} does not exist. Did the build run?`,
  );
  console.error("  This is not a pass.");
  process.exit(2);
}

/** Read a file, or record why we could not and keep the structured output. */
function readOrFail(file, label) {
  try {
    return readFileSync(file, "utf8");
  } catch (error) {
    bad(label, `could not read ${file}: ${error.message}`);
    return null;
  }
}

/**
 * Draft slugs are DERIVED from content/, not hardcoded. A hardcoded slug stops
 * testing anything the moment the fixture is renamed — and does so silently,
 * which is the failure mode this whole script exists to remove.
 */
function draftSlugs() {
  const root = join(process.cwd(), "content");
  const slugs = [];
  if (!existsSync(root)) return slugs;
  for (const type of readdirSync(root)) {
    const dir = join(root, type);
    if (!statSync(dir).isDirectory()) continue;
    for (const name of readdirSync(dir)) {
      if (!/\.mdx?$/.test(name)) continue;
      const body = readFileSync(join(dir, name), "utf8");
      const front = body.split("---")[1] ?? "";
      if (/^draft:\s*true\s*$/m.test(front))
        slugs.push(name.replace(/\.mdx?$/, ""));
    }
  }
  return slugs;
}

/**
 * Rendered HTML only. `.nft.json` file-trace manifests list every file a route
 * MIGHT read, including the whole content directory — so they mention draft
 * slugs legitimately. Grepping them would fail this check for a reason that
 * has nothing to do with what shipped.
 */
function htmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const pages = htmlFiles(appDir);
const failures = [];
const checks = [];
const ok = (label) => checks.push(`✓ ${label}`);
const bad = (label, detail) => {
  failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
};

// ── the build produced something ────────────────────────────────────────────
// An assertion that only proves ABSENCE passes when everything is absent.
if (pages.length < 5)
  bad(`only ${pages.length} rendered page(s) — build looks empty`);
else ok(`${pages.length} rendered pages`);

const published = pages.filter((f) => /introducing-mergewatch\.html$/.test(f));
if (!published.length)
  bad("published article introducing-mergewatch.html was not emitted");
else ok("published articles present");

// ── drafts must never ship, whatever the preview flag says ──────────────────
const drafts = draftSlugs();
if (!drafts.length) {
  // content/ ships a deliberate draft as a publication-safety fixture. With
  // none present these checks would pass vacuously and prove nothing.
  bad("no draft content found — the publication-safety fixture is missing");
} else {
  ok(
    `${drafts.length} draft slug(s) derived from content: ${drafts.join(", ")}`,
  );

  const draftPages = pages.filter((f) =>
    drafts.some((slug) => f.includes(slug)),
  );
  if (draftPages.length) bad("draft page emitted", draftPages.join(", "));
  else ok("no draft page emitted");

  const leaked = pages.filter((f) => {
    const body = readOrFail(f, "scanning rendered HTML for draft slugs");
    return body !== null && drafts.some((slug) => body.includes(slug));
  });
  if (leaked.length)
    bad("draft slug appears in rendered HTML", leaked.slice(0, 3).join(", "));
  else ok("draft slugs absent from all rendered HTML");
}

// ── environment-specific expectations ───────────────────────────────────────
// Only ever assert against a KNOWN published article. Falling back to pages[0]
// could land on _not-found.html and either produce a confusing second failure
// or pass on a page that proves nothing.
const sample = published[0] ?? null;
const html = sample ? readOrFail(sample, "reading the sample article") : null;

if (!html) {
  bad("no published article to check canonical/noindex against");
} else if (mode === "production") {
  if (!html.includes('href="https://mergewatch.ai/blog'))
    bad("canonical does not point at https://mergewatch.ai/blog", sample);
  else ok("canonical points at the production origin");

  if (/noindex/i.test(html)) bad("production page carries noindex", sample);
  else ok("no noindex on production output");
} else {
  if (!/noindex/i.test(html)) bad("staging page is missing noindex", sample);
  else ok("staging output carries noindex");

  // Canonicals stay production-absolute even on staging — that is the design.
  if (!html.includes('href="https://mergewatch.ai/blog'))
    bad("staging canonical does not point at the production origin", sample);
  else ok("staging canonical still points at production");
}

for (const line of checks) console.log(`  ${line}`);
if (failures.length) {
  console.error(
    `\n✗ ${mode} build output failed ${failures.length} check(s):\n`,
  );
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\n✓ ${mode} build output verified.`);
