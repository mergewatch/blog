import { describe, expect, it } from "vitest";
import { getAllContent, validateAllContent } from "@/lib/content";

describe("content publication safeguards", () => {
  it("accepts all frontmatter, slugs, authors, images, and internal links", () => {
    expect(validateAllContent().errors).toEqual([]);
  });

  it("excludes drafts by default", () => {
    process.env.NEXT_PUBLIC_SHOW_DRAFTS = "false";
    expect(getAllContent().some((item) => item.draft)).toBe(false);
  });

  it("never includes drafts in production even when the preview flag is set", () => {
    const previousEnvironment = process.env.DEPLOYMENT_ENV;
    const previousDrafts = process.env.NEXT_PUBLIC_SHOW_DRAFTS;
    process.env.DEPLOYMENT_ENV = "production";
    process.env.NEXT_PUBLIC_SHOW_DRAFTS = "true";
    expect(getAllContent().some((item) => item.draft)).toBe(false);
    process.env.DEPLOYMENT_ENV = previousEnvironment;
    process.env.NEXT_PUBLIC_SHOW_DRAFTS = previousDrafts;
  });
});
