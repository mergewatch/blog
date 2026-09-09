# MergeWatch blog agent guide

- Before changing visual branding, inspect the current `mergewatch/mergewatch.ai` dashboard tokens, logo, navigation, and public pages. This repository must remain a visual extension of that product.
- Preserve SEO invariants: canonical content stays under `https://mergewatch.ai/blog`; never emit Amplify, CloudFront, development, or self-hosted canonical URLs.
- Only the exact `DEPLOYMENT_ENV=production` configuration may be indexable. Every other environment must emit both page-level `noindex, nofollow` and a blocking robots.txt.
- Never let drafts enter a production page, archive, feed, sitemap, static parameter, or related-content result.
- Keep official editorial content independent from self-hosted MergeWatch. Customer installations may link here but must not serve or duplicate it.
- Prefer static server components and build-time Markdown. Avoid databases, authentication, runtime AWS dependencies, arbitrary MDX execution, or new client dependencies without a concrete need.
- Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate:content`, and `pnpm build` before handing off changes.
