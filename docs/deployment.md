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

## Promotion

Amplify deploys `development` automatically for editorial review. Promote an approved commit through a pull request to `main`; that branch is the only deployment configured as production and indexable. GitHub Actions does not deploy, preventing two CD systems from racing.
