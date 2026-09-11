# AWS Amplify deployment

## Connect the repository

1. Create one Amplify Hosting app and connect this standalone repository.
2. Enable branch deployments for `development` and `main`. Optional PR previews are safe because all non-production configurations fail closed to noindex.
3. Amplify reads the root `amplify.yml`, installs pinned pnpm 10.23.0, runs all checks, and publishes Next.js server output from `.next`.
4. Configure environment variables per branch:

| Branch        | `NEXT_PUBLIC_BASE_PATH` | `DEPLOYMENT_ENV` |
| ------------- | ----------------------- | ---------------- |
| `development` | `/blog`                 | `development`    |
| `main`        | `/blog`                 | `production`     |
| previews      | `/blog`                 | `preview`        |

`main` will refuse to build without `DEPLOYMENT_ENV=production` — the site would
otherwise deploy successfully and be invisible to search.

Leave `NEXT_PUBLIC_SHOW_DRAFTS=false` in hosted environments. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` only on production if analytics is wanted.

## Routing and custom domains

Amplify custom domains map hostnames/subdomains, not a path on a hostname to a second Amplify app. Consequently, connecting this app directly to `mergewatch.ai` cannot by itself make only `/blog/*` resolve here while the product app serves the remaining paths.

Manual infrastructure work is required:

1. Give the blog Amplify app a stable origin hostname.
2. At the CloudFront or other edge layer that owns `mergewatch.ai`, add ordered behaviors for `/blog` and `/blog/*` pointing to that origin. Preserve the incoming `/blog` path because this app is built with `basePath=/blog`.
3. Add equivalent routing for `development.mergewatch.ai` to the `development` branch origin.
4. Ensure the origin forwards Next.js asset, image, and route requests beneath `/blog/_next/*`.
5. Attach certificates and DNS aliases for the two public hostnames to the edge distribution—not to an unrelated self-hosted product instance.
6. Smoke-test `/blog`, an article, `/blog/rss.xml`, `/blog/sitemap.xml`, and `/blog/robots.txt` before allowing production indexing.

If the existing edge cannot route by path, deploy the app temporarily on a MergeWatch-controlled subdomain and keep `/blog` support enabled for a later reverse proxy. Do not silently publish a different canonical architecture, and never point customer/self-hosted domains at this content.

## robots.txt lives in three places, and only one of them is this app

`app/robots.ts` is served at `/blog/robots.txt` because the app is mounted at
`basePath=/blog`. **Crawlers only read a host root**, so that file governs
nothing on its own. Three hosts, three answers:

| URL a crawler fetches                       | Served by                        | Says                                  |
| ------------------------------------------- | -------------------------------- | ------------------------------------- |
| `mergewatch.ai/robots.txt`                  | the **dashboard** app            | allow, and must list the blog sitemap |
| `blog.mergewatch.ai/robots.txt`             | this app, via an Amplify rewrite | `Disallow: /`                         |
| `development-blog.mergewatch.ai/robots.txt` | same                             | `Disallow: /`                         |

The origin hostnames exist so the `/blog` proxy has something to fetch. They
serve the same pages as the canonical URLs, so leaving them crawlable would
publish a second copy of the whole blog.

**The mechanism:** `public/origin-robots.txt` is served under the base path at
`/blog/origin-robots.txt`, and an Amplify custom rule on the blog app rewrites
the host root onto it:

```
/robots.txt  ->  /blog/origin-robots.txt  [200]
```

**Do not fix this by making `app/robots.ts` emit `Disallow: /`.** That file is
also served through the proxy at `mergewatch.ai/blog/robots.txt`, and it is the
one that must eventually say _allow_ for the canonical host. Nor by removing
`basePath` — that changes every canonical and asset path, and
`tests/environment.test.ts` asserts the current behaviour.

**Do not add `X-Robots-Tag: noindex` to the origin hosts.** The proxy fetches
from those same hosts, so unless a proxied request can be told apart from a
direct one — and Amplify rewrites give no dependable header to key on — that
header would deindex the canonical URL too. Failing silently, weeks later.

## Promotion

Amplify deploys `development` automatically for editorial review. Promote an approved commit through a pull request to `main`; that branch is the only deployment configured as production and indexable. GitHub Actions does not deploy, preventing two CD systems from racing.
