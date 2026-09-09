---
title: "Introducing MergeWatch"
description: "An open-source pull request reviewer that keeps the model, prompts, and final decision in your hands."
date: "2026-08-18"
updated: "2026-09-08"
author: "MergeWatch Team"
category: "Company"
tags: [open-source, code-review, product]
featured: true
draft: false
related: [why-we-stopped-saying-safe-to-merge, code-review-is-not-ci]
---

Software teams are writing more code, faster. Review capacity has not increased at the same rate. MergeWatch is our answer: an open-source reviewer that runs focused agents against every pull request, then gives a human reviewer a compact, prioritized view of the change.

## The reviewer should be inspectable

Code review sits on a sensitive boundary. A useful system sees the code you are about to ship and influences what receives human attention. That system should not be a black box.

MergeWatch keeps the review pipeline in the open:

- prompts and orchestration are source-available under AGPL v3;
- teams choose the model provider;
- self-hosted deployments keep code inside the operator's infrastructure;
- the human reviewer retains merge authority.

```yaml
# .mergewatch.yml
agents:
  - name: security
    focus: "Trust boundaries, injection, and secret exposure"
  - name: reliability
    focus: "Failure modes, retries, and resource cleanup"
```

## Several narrow opinions beat one vague opinion

MergeWatch splits a review into specialist passes. A security pass asks different questions than an architecture pass. The results are deduplicated, ranked by confidence and severity, and returned as a single evolving review rather than a stream of noisy comments.

| Principle    | What it means in practice              |
| ------------ | -------------------------------------- |
| Inspectable  | Prompts and orchestration are visible  |
| Portable     | Hosted or self-hosted, with your model |
| Proportional | Findings carry severity and confidence |
| Human-led    | MergeWatch advises; maintainers decide |

> Automation earns trust by showing its work and respecting the boundary of what it can know.

Start with the [source code](https://github.com/mergewatch/mergewatch.ai), then read why [code review is not CI](/code-review-is-not-ci).
