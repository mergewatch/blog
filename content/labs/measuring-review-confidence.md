---
title: "Measuring Review Confidence Without Pretending It Is Probability"
description: "A working method for calibrating review findings against evidence quality and maintainer outcomes."
date: "2026-09-03"
updated: "2026-09-07"
author: "MergeWatch Team"
category: "Research"
tags: [ai, evaluation, code-review]
featured: false
draft: false
related: [why-we-stopped-saying-safe-to-merge]
---

Confidence labels are attractive because they compress a complicated judgment into one number. They are dangerous for exactly the same reason.

## What we measure

Our early evaluation separates three observable questions:

1. Did the finding identify a concrete behavior in the patch?
2. Could a maintainer reproduce or falsify it from the supplied evidence?
3. Did the maintainer accept the finding as actionable?

We do **not** interpret a score of 0.8 as an 80% probability that the pull request contains a bug. The score ranks evidence within a review batch.

```text
patch → candidate finding → evidence check → deduplication → maintainer
```

## Calibration needs negative examples

Only grading accepted findings rewards systems for silence about their misses. Our evaluation set therefore includes seeded defects, ordinary clean changes, ambiguous design choices, and changes whose real failure appears outside the diff.

> A calibrated reviewer knows when the patch does not contain enough information to support a claim.

We will publish the rubric and anonymized aggregate results after the protocol survives a few rounds of adversarial testing.
