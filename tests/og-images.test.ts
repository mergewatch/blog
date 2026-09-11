import { describe, expect, it } from "vitest";
import {
  dynamic,
  dynamicParams,
  generateStaticParams,
} from "@/app/og/[type]/[slug]/route";
import { contentTypes, getAllContent } from "@/lib/content";

describe("OG images are prerendered", () => {
  it("is built at build time, not per request", () => {
    // As a dynamic route this returned 500 on every host: ImageResponse
    // streams, and Amplify's SSR adapter cannot pipe a streamed response.
    // Nothing here needs a request, so there is no reason for it to be dynamic.
    expect(dynamic).toBe("force-static");
    expect(dynamicParams).toBe(false);
  });

  it("covers every published item, across every content type", () => {
    const params = generateStaticParams();
    const published = getAllContent();
    expect(params).toHaveLength(published.length);
    // The route takes a `type`; a params list missing a content type would
    // leave its entries with a 404 image and no failing test.
    expect(new Set(params.map((p) => p.type))).toEqual(new Set(contentTypes));
  });

  it("does not generate an image for drafts", () => {
    // Compare (type, slug) pairs, which is what identifies an OG image — the
    // route is /og/[type]/[slug]. Matching on slug alone would FAIL whenever a
    // draft shared a slug with a published item of a DIFFERENT type: the slug
    // would be present, supplied by the published item, and the assertion
    // would read that as the draft having leaked.
    const pairs = generateStaticParams().map((p) => `${p.type}/${p.slug}`);
    const drafts = getAllContent({ includeDrafts: true }).filter(
      (i) => i.draft,
    );
    expect(drafts.length, "the draft fixture is missing").toBeGreaterThan(0);
    for (const draft of drafts)
      expect(pairs).not.toContain(`${draft.type}/${draft.slug}`);
  });
});
