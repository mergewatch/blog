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

  it("gives the blog root a canonical URL without a trailing slash", async () => {
    // /blog/ 308-redirects to /blog, so a trailing slash would put a redirect
    // into the sitemap and the breadcrumb JSON-LD.
    const { canonicalRoot, canonicalUrl } = await import("@/lib/site");
    expect(canonicalRoot).toBe("https://mergewatch.ai/blog");
    for (const path of [undefined, "", "/"])
      expect(canonicalUrl(path), String(path)).toBe(canonicalRoot);
    expect(canonicalUrl("/tag/ai/")).toBe("https://mergewatch.ai/blog/tag/ai");
  });

  it("lists no redirecting URLs in the production sitemap", async () => {
    process.env.DEPLOYMENT_ENV = "production";
    const { default: sitemap } = await import("@/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://mergewatch.ai/blog");
    for (const url of urls) expect(url.endsWith("/"), url).toBe(false);
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

  it("bakes DEPLOYMENT_ENV into the build so runtime page rebuilds keep it", async () => {
    // Pages revalidate at runtime, and Amplify's SSR runtime has no console
    // environment variables. Without this, production pages rebuilt after a
    // deploy read DEPLOYMENT_ENV as unset and served noindex, nofollow.
    process.env.DEPLOYMENT_ENV = "production";
    const { default: production } = await import("@/next.config");
    expect(production.env?.DEPLOYMENT_ENV).toBe("production");

    vi.resetModules();
    delete process.env.DEPLOYMENT_ENV;
    const { default: unset } = await import("@/next.config");
    expect(unset.env?.DEPLOYMENT_ENV).toBe("");
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
