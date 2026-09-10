import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  delete process.env.DEPLOYMENT_ENV;
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});

describe("environment SEO safety", () => {
  it("uses production canonicals in every environment", async () => {
    // Canonicals are built from PRODUCTION_ORIGIN + basePath and never from the
    // serving host, so staging and preview advertise the production URL. This
    // used to set NEXT_PUBLIC_SITE_URL to prove the point, but nothing reads
    // that variable, so the assertion held trivially. Vary the environment
    // instead — that is what actually differs between deployments.
    for (const environment of ["development", "preview", "production"]) {
      vi.resetModules();
      process.env.DEPLOYMENT_ENV = environment;
      const { canonicalUrl } = await import("@/lib/site");
      expect(canonicalUrl("example"), environment).toBe(
        "https://mergewatch.ai/blog/example",
      );
    }
  });

  it("marks all non-production pages noindex and nofollow", async () => {
    process.env.DEPLOYMENT_ENV = "development";
    const { robotsMetadata } = await import("@/lib/metadata");
    expect(robotsMetadata).toMatchObject({ index: false, follow: false });
  });

  it("only permits indexing for the explicit production environment", async () => {
    process.env.DEPLOYMENT_ENV = "production";
    const { robotsMetadata } = await import("@/lib/metadata");
    expect(robotsMetadata).toMatchObject({ index: true, follow: true });
  });

  it("blocks every crawler in non-production robots.txt", async () => {
    process.env.DEPLOYMENT_ENV = "preview";
    const { default: robots } = await import("@/app/robots");
    expect(robots()).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("publishes canonical robots and no staging sitemap in the appropriate environments", async () => {
    process.env.DEPLOYMENT_ENV = "production";
    const { default: productionRobots } = await import("@/app/robots");
    expect(productionRobots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://mergewatch.ai/blog/sitemap.xml",
    });

    vi.resetModules();
    process.env.DEPLOYMENT_ENV = "development";
    const { default: stagingSitemap } = await import("@/app/sitemap");
    expect(stagingSitemap()).toEqual([]);
  });

  it("normalizes base paths", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/blog/";
    const { basePath } = await import("@/lib/site");
    expect(basePath).toBe("/blog");
  });
});
