---
title: "Why we're building MergeWatch"
description: "AI made writing code cheap, but review is where trust gets decided. Why we are building an open, inspectable PR reviewer instead of another black box."
date: "2026-09-10"
author: "MergeWatch Team"
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

## How MergeWatch works

MergeWatch is a GitHub App that reviews pull requests using a set of specialist agents.

- **Parallel specialist agents:** Instead of a single pass over the diff, separate agents look for security issues, bugs, and style problems, alongside a summary with a risk rating and a diagram of the change. They run concurrently, so a typical review completes in under a minute.
- **A single, ranked comment:** An orchestrator de-duplicates the findings, ranks them by severity, and posts one comment — signal over volume.
- **Context beyond the diff:** Agents can pull in other files from the repository when the diff alone does not tell the whole story.
- **Per-repository configuration:** A `.mergewatch.yml` file lets you tune the review or add agents of your own.

## Open by design

The part that matters most to us is how MergeWatch is built and deployed.

- **Open source under AGPL v3:** The entire review pipeline is on GitHub for you to read, fork, and improve.
- **Bring your own model:** Use the provider you already trust — Amazon Bedrock, Anthropic, Google Gemini, OpenAI and many others via LiteLLM, or local models through Ollama (experimental).
- **Run it in your own cloud:** Self-host with Docker Compose on AWS, GCP, Azure, or bare metal, and your code never leaves your infrastructure.
- **Priced per PR, not per seat:** The hosted version charges for reviews rather than headcount, and self-hosting is free.

## A review agent, not a generation agent

MergeWatch does not write your code or open pull requests on your behalf. It is built to help the engineers who approve changes do that job well. Many tools are focused on producing more code; we believe the more durable problem is making sure what gets merged is worth merging.

## Starting with open source maintainers

Maintainers are feeling this shift the most. Public repositories are receiving a growing wave of AI-generated contributions, and the people reviewing them are largely volunteers.

That is why we are offering [MergeWatch for Open Source](https://mergewatch.ai/open-source), which provides free hosted reviews for qualifying public repositories. If you maintain a project and review load is slowing you down, we would love to have you apply.

## Where we are today

MergeWatch is early. It works, and it has rough edges. This is a soft launch, and we want it in the hands of people who care about code review before any bigger push.

## Get involved

- **Try it:** Install the GitHub App from [mergewatch.ai](https://mergewatch.ai). Your first reviews are free, with no credit card required.
- **Self-host it:** Star the repository at [github.com/mergewatch/mergewatch.ai](https://github.com/mergewatch/mergewatch.ai), clone or fork and run `docker compose up -d`.
- **Bring it to your project:** Apply for [MergeWatch for Open Source](https://mergewatch.ai/open-source).
- **Share feedback:** Noisy findings, missed bugs, missing features — open an issue or reach out directly.

We hope you find MergeWatch useful. Please share how your team has been handling code review as more of it is written by AI — your insights will directly shape what we build next.

— Santthosh
