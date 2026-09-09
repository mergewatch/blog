---
title: "Parallel Review Agents and Clearer Confidence Labels"
description: "MergeWatch 0.6 runs specialist reviews concurrently and makes evidence strength explicit in every finding."
date: "2026-09-05"
author: "MergeWatch Team"
category: "Product"
tags: [release, agents, code-review]
featured: false
draft: false
version: "v0.6.0"
related: [introducing-mergewatch, measuring-review-confidence]
---

MergeWatch 0.6 makes the review loop faster and the output more precise.

## Added

- Security, bug, style, summary, and architecture agents now run concurrently.
- Findings include explicit confidence and severity fields.
- The final comment updates in place instead of creating a new comment on every run.
- Custom agents can read repository instructions from `AGENTS.md`.

## Changed

Finding language now describes concrete evidence rather than assigning a blanket “safe” or “unsafe” status to the pull request. See [why we made that change](/why-we-stopped-saying-safe-to-merge).

## Upgrade notes

Self-hosted operators should pull the new image and run the included database migration before restarting workers. Existing `.mergewatch.yml` files remain compatible.
