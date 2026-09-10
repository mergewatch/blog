import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The origin hostnames must not be indexed as a second copy of the blog (#5).
 *
 * `app/robots.ts` cannot do this job: with basePath=/blog it is served at
 * /blog/robots.txt, and crawlers only read a host root. This file is rewritten
 * to /robots.txt on the origin hosts by an Amplify custom rule.
 */
const robots = readFileSync(
  resolve(process.cwd(), "public/origin-robots.txt"),
  "utf8",
);

describe("origin robots.txt", () => {
  it("disallows every crawler", () => {
    expect(robots).toMatch(/^User-agent:\s*\*$/m);
    expect(robots).toMatch(/^Disallow:\s*\/$/m);
  });

  it("advertises no sitemap", () => {
    // A sitemap here would invite crawling of the very host this file exists
    // to keep out of the index.
    expect(robots).not.toMatch(/^Sitemap:/im);
  });

  it("never says Allow, which would defeat the point", () => {
    expect(robots).not.toMatch(/^Allow:/im);
  });

  it("explains why it exists, since its purpose is not obvious from its path", () => {
    expect(robots).toMatch(/mergewatch\.ai\/blog/);
  });
});
