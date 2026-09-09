---
title: 'Why We Stopped Saying "Safe to Merge"'
description: "Code review can assess a change, but that is not the same thing as proving a build is safe to merge."
date: "2026-09-08"
author: "MergeWatch Team"
category: "Engineering"
tags: [code-review, ai, pull-requests]
featured: false
draft: false
related: [code-review-is-not-ci, introducing-mergewatch]
---

“Safe to merge” sounds useful. It is also a claim a code review system cannot honestly make.

A reviewer sees a patch and some surrounding context. It may identify a missing authorization check, a race, or an API contract change. It usually cannot prove the absence of failure across production data, configuration, infrastructure, and dependencies.

## Confidence is scoped

We now describe review output using two separate dimensions:

1. **Severity** estimates the consequence if a finding is real.
2. **Confidence** estimates how strongly the visible evidence supports it.

```ts
type Finding = {
  severity: "critical" | "high" | "medium" | "low";
  confidence: number; // evidence strength, not merge safety
  evidence: string;
};
```

High confidence in a specific finding is not high confidence in the entire change. That distinction keeps the tool's language aligned with its evidence.

## Better words create better decisions

The most useful review says: “this new cache key omits the tenant ID, so two tenants can share an entry.” It does not say: “unsafe.” One gives a maintainer something falsifiable to inspect; the other borrows authority from a test suite it did not run.

CI answers whether declared checks passed. Review examines whether the change deserves different checks or human attention. We need both, and [they should not impersonate each other](/code-review-is-not-ci).
