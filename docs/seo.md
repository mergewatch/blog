# SEO invariants

Production is the only indexable environment. The exact switch is `DEPLOYMENT_ENV=production`; unset, misspelled, development, preview, and branch environments all emit page-level `noindex, nofollow` and a blocking robots.txt.

All canonical URLs are constructed from `https://mergewatch.ai` plus the configured base path. Content canonical overrides are validated to remain under `https://mergewatch.ai/blog/`.

Production generates:

- canonical and social metadata for every page;
- `BlogPosting` or `ScholarlyArticle` plus `BreadcrumbList` per article;
- one shared `Organization`, `WebSite`, and `Blog` entity in the root layout;
- `/rss.xml` from published content;
- `/sitemap.xml` with published content and non-empty archives only;
- `/robots.txt` pointing at the canonical sitemap.

Drafts are filtered before pages, feeds, sitemaps, archives, related content, or static parameters are generated. Staging sitemaps are empty. Do not replace explicit production detection with hostname inference: Amplify and proxy hostnames are easy to misconfigure.

When adding structured data, reference the existing organization ID (`https://mergewatch.ai/#organization`) instead of declaring a second organization.
