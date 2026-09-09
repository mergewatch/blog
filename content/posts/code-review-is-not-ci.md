---
title: "Code Review Is Not CI"
description: "Tests evaluate declared expectations; review looks for the expectation nobody thought to declare."
date: "2026-08-28"
author: "MergeWatch Team"
category: "Engineering"
tags: [code-review, ci, pull-requests]
featured: false
draft: false
related: [why-we-stopped-saying-safe-to-merge]
---

CI and code review both sit between a commit and a merge, but they solve different problems.

## CI evaluates a specification

A test encodes an expectation. Given known inputs, the program should produce known outputs. Static analysis applies another declared specification: this value must not be nullable; this call must be awaited.

Review starts where those declarations end. It asks whether the specification itself is incomplete.

| Continuous integration    | Code review                      |
| ------------------------- | -------------------------------- |
| Repeats declared checks   | Searches for missing assumptions |
| Produces pass or fail     | Produces evidence and judgment   |
| Optimized for determinism | Comfortable with ambiguity       |
| Gates automatically       | Supports a human decision        |

## A concrete boundary

Imagine a pull request that changes a cache from per-user to per-project. Every test passes because the fixtures contain one user per project. CI is correct: the software satisfies its encoded expectations. Review can still notice that the authorization boundary and the cache boundary no longer match.

```diff
- const key = `${projectId}:${userId}`;
+ const key = projectId;
```

The right outcome is not to replace CI with an AI reviewer. It is to let each system make the claim it can support—and no larger one. That is also [why we retired “safe to merge”](/why-we-stopped-saying-safe-to-merge).
