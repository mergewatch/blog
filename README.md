# MergeWatch Blog

The official publication site for MergeWatch engineering articles and product updates. It is a standalone Next.js 15 application, with Markdown in Git as its content system.

> This repository owns official MergeWatch editorial content. Self-hosted MergeWatch installations do not host or duplicate this content.

The separation is deliberate. The open-source product can run at any customer-controlled hostname; canonical editorial content only lives on MergeWatch-controlled infrastructure.

## Local development

Requirements: Node.js 20+ and pnpm 10.23.0.

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

With the default base path, open `http://localhost:3000/blog`. Set `NEXT_PUBLIC_BASE_PATH=` to serve at the local root instead.

Run the complete verification suite before opening a pull request:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:content
pnpm build
```

## Write and publish

Add Markdown to `content/posts`. The filename is the slug. Author profiles live in `content/authors`. See [the authoring guide](docs/content-authoring.md).

Drafts use `draft: true`. They are excluded by default and can only be previewed outside production with `NEXT_PUBLIC_SHOW_DRAFTS=true`. The production environment ignores that switch.

The intended flow is feature branch → pull request/CI → `development` → staging review → `main` → production. Amplify branch deployments own CD; GitHub Actions intentionally performs CI only.

## URL and deployment architecture

The app defines its homepage at `/` and uses Next.js `basePath=/blog`, producing:

- `https://mergewatch.ai/blog`
- `https://mergewatch.ai/blog/article-slug`

This avoids `/blog/blog/...`. Canonicals are always generated beneath `https://mergewatch.ai/blog`, even on staging or Amplify previews. Only `DEPLOYMENT_ENV=production` is indexable; every other value fails closed to `noindex, nofollow` at both page and robots.txt levels.

AWS Amplify custom-domain mappings are host-based and do not natively combine two separately deployed apps beneath different paths of one hostname. The blog app is independently deployable, but production needs the main `mergewatch.ai` edge/router to reverse-proxy `/blog` and `/blog/*` to its Amplify origin while preserving the path. See [deployment](docs/deployment.md), [SEO invariants](docs/seo.md), and `.env.example`.
