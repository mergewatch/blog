---
title: "Why we're building MergeWatch"
description: "AI made writing code cheap, but review is where trust gets decided. Why we are building an open, inspectable PR reviewer instead of another black box."
date: "2026-09-10"
author: "Santthosh"
category: "Company"
tags: [mergewatch, code-review, ai, open-source]
image: "/images/posts/why-we-are-building-mergewatch.png"
draft: false
---

_AI has made writing code cheap. Reviewing it is still expensive — and review is where trust gets decided._

![A pull request flows through MergeWatch's open pipeline of parallel review agents into a single comment ranked by severity](/images/posts/why-we-are-building-mergewatch.png)

Every change that reaches production passes through one step no pipeline can automate away: a person reading a pull request and deciding it is safe to merge. As engineering organizations grow, that step quietly becomes one of the most important controls they have.

I have spent about twenty years building platforms — and the same lesson shows up in all of them. The systems people trust are the ones they can inspect. An access policy you cannot read, an event you cannot trace, or a change you cannot audit will eventually cost you.

That lens is why I started MergeWatch, and it shapes every decision about how we are building it.

## Writing code got cheap, but reviewing it did not

Coding assistants now write a large share of the code that lands in pull requests. Output per engineer is up, and PRs are bigger and more frequent than they were even a few months ago.

The reviewer, however, has not changed. It is still a person with the same hours in the day, reading a diff they did not write and deciding whether it is safe to merge.

This is the new bottleneck, and it matters more than generation because review is the control point — it is where a team decides what reaches production and who is accountable for it. Making code faster to write does not make approving it any less important.

So the problem we set out to solve was not how to generate more code. It was how to help the people who approve it keep up, without lowering the bar.

## Why a black-box reviewer is not enough

AI review tools already exist, and some of them are good. Most of them, however, are black boxes.

A comment appears on your pull request, but you do not know which model wrote it, what prompt produced it, what context it saw, or why it flagged one line and skipped another. When it misses a real bug, there is no way to find out why. When it is noisy, the only option is to ignore it — and over time, teams do.

In platform engineering, we would never accept an authorization layer we could not audit. The system that sits in front of every merge deserves the same standard. If an AI has a voice in what ships, you should be able to read how it works, change it, and run it on your own terms.

That is the idea behind MergeWatch: frontier-model PR review, without the black box.

We hope you find MergeWatch useful. Please share how your team has been handling code review as more of it is written by AI — your insights will directly shape what we build next.

— Santthosh
