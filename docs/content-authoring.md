# Content authoring

## Collections and URLs

| Directory                  | Public URL with `/blog` base path |
| -------------------------- | --------------------------------- |
| `content/posts/my-post.md` | `/blog/my-post`                   |
| `content/authors/name.md`  | `/blog/authors/name`              |

Use lowercase kebab-case filenames. Slugs must be unique so related-post references remain unambiguous.

## Frontmatter

```yaml
---
title: "A precise, human title"
description: "A standalone summary of at least twenty characters."
date: "2026-09-08"
updated: "2026-09-09" # optional; must not precede date
author: "MergeWatch Team" # must match an author profile
category: "Engineering" # Company, Engineering, Product, or Research
tags: [code-review, ai]
draft: false
canonical: "https://mergewatch.ai/blog/custom-path" # optional
image: "/images/posts/example.png" # optional; must exist
related: [another-slug] # optional
---
```

`pnpm validate:content` checks schema, dates, duplicate slugs, image paths, authors, related references, canonical ownership, and internal Markdown links. `pnpm build` runs it automatically.

## Markdown support

GitHub-flavored Markdown is supported, including tables, task lists, fenced code blocks, blockquotes, and images. Headings receive linkable IDs and syntax highlighting is generated at build time. Markdown is parsed without arbitrary MDX JavaScript execution. Put images under `public/images/posts` or `public/images/authors` and always provide useful alt text.

Internal links use app-relative paths without the deployment base path, such as `[read more](/article-slug)`. Next.js adds `/blog` at runtime.

## Drafts

Drafts never render in production, even if `NEXT_PUBLIC_SHOW_DRAFTS=true` is accidentally configured. For local review:

```bash
DEPLOYMENT_ENV=development NEXT_PUBLIC_SHOW_DRAFTS=true pnpm dev
```
