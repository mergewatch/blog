import { describe, expect, it } from "vitest";
import {
  dynamic,
  dynamicParams,
  generateStaticParams,
  revalidate as ogRevalidate,
} from "@/app/og/[type]/[slug]/route";
import { revalidate as defaultImageRevalidate } from "@/app/opengraph-image";
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

  it("keeps the immutable cache the documents gave up (#21)", () => {
    // The root layout sets revalidate=300 so documents stop being cached for a
    // year. Route segment config INHERITS, so without an explicit value here
    // these images would silently pick up a 5-minute revalidate — they only
    // happened not to, which is not the same as being intended to.
    //
    // Images are content-addressed: the URL carries a hash that changes with
    // the content, so there is nothing to revalidate and every reason to keep
    // the long cache.
    // The document side is asserted in verify-build-output.ts, against the
    // built manifest: importing app/layout here drags next/font into vitest.
    expect(ogRevalidate).toBe(false);
    expect(defaultImageRevalidate).toBe(false);
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
