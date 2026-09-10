import { describe, expect, it } from "vitest";
import {
  dynamic,
  dynamicParams,
  generateStaticParams,
} from "@/app/og/[type]/[slug]/route";
import { getAllContent } from "@/lib/content";

describe("OG images are prerendered", () => {
  it("is built at build time, not per request", () => {
    // As a dynamic route this returned 500 on every host: ImageResponse
    // streams, and Amplify's SSR adapter cannot pipe a streamed response.
    // Nothing here needs a request, so there is no reason for it to be dynamic.
    expect(dynamic).toBe("force-static");
    expect(dynamicParams).toBe(false);
  });

  it("covers every published item, across all three content types", () => {
    const params = generateStaticParams();
    const published = getAllContent();
    expect(params).toHaveLength(published.length);
    // The route takes a `type`; a params list covering only posts would leave
    // changelog and labs entries with a 404 image and no failing test.
    expect(new Set(params.map((p) => p.type))).toEqual(
      new Set(["posts", "changelog", "labs"]),
    );
  });

  it("does not generate an image for drafts", () => {
    const slugs = generateStaticParams().map((p) => p.slug);
    const drafts = getAllContent({ includeDrafts: true }).filter(
      (i) => i.draft,
    );
    expect(drafts.length, "the draft fixture is missing").toBeGreaterThan(0);
    for (const draft of drafts) expect(slugs).not.toContain(draft.slug);
  });
});
