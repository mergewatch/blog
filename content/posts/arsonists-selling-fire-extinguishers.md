---
title: "Arsonists Selling Fire Extinguishers"
description: "OpenAI is building frontier cyber-defense while frontier capability makes attack cheaper. Why 41 protected projects is the wrong number, and why MergeWatch is free for open source."
date: "2026-09-19"
author: "Yasha Spong"
category: "Company"
tags: [ai, security, open-source, supply-chain, code-review]
image: "/images/posts/robots-on-fire.png"
draft: false
related: [why-we-are-building-mergewatch]
---

_AI companies should help defend the world against the risks they create. That is a responsibility — not a market opportunity._

![A robot kneels engulfed in flames with its hands raised while a second robot sprays it with a fire extinguisher, on a wet rooftop above a city skyline at sunset](/images/posts/robots-on-fire.png)

OpenAI is building increasingly powerful cybersecurity capabilities. Its Daybreak initiative uses frontier models to find vulnerabilities, validate them, and help generate patches. OpenAI describes a future in which AI agents continuously examine software and infrastructure for weaknesses, potentially operating at a speed and scale human security teams cannot match.

Good. We are going to need them.

Because the same extraordinary capabilities that make these systems useful for defense also make them extraordinarily useful for attack. And there is something deeply uncomfortable about an industry building increasingly dangerous capabilities, warning the rest of us about the consequences, and then building a business around protecting us from those consequences.

At some point, it starts to look like arsonists selling fire extinguishers.

## The $1 billion answer

There is an obvious response to this criticism. OpenAI is not doing nothing.

It has committed substantial resources to cyber defense and has explicitly identified open-source maintainers as a group that needs help. Its Patch the Planet initiative, built with Trail of Bits and other security partners, pairs frontier AI with expert human researchers to find, validate, and patch vulnerabilities in important open-source projects. OpenAI currently reports $17 million in API credits and direct support for open-source security, 41 codebases under review, 858 issues identified, 263 patches produced, and 143 patches accepted upstream.

That is real work. It is also worth putting those numbers in perspective.

There are millions of open-source repositories and an enormous long tail of software quietly sitting underneath the world's companies, governments, hospitals, financial systems, developer tools, and infrastructure. Forty-one projects are receiving this kind of intensive review.

So what happens if you're number 42? Or number 4,200? Or number 420,000?

That is where the grand commitments become considerably less satisfying. The problem isn't that OpenAI is doing nothing. The problem is the enormous gap between announcing resources for "frontline defenders" and creating a practical, predictable mechanism through which the people actually defending software can receive meaningful help.

A commitment is not a distribution mechanism.

OpenAI's own description of Patch the Planet makes clear that this is currently a curated, expert-assisted program. Initial participants included projects such as Python, Go, cURL, Sigstore and pyca/cryptography — hugely important infrastructure worthy of protection. But this isn't something every maintainer can simply switch on, and that distinction matters.

If the danger is truly systemic, the defense must eventually be systemic too.

## You don't get to externalize the risk

The deeper problem is responsibility.

The frontier AI companies are engaged in a breathtaking race to build more capable autonomous systems. With every generation, those systems become better at reasoning, coding, using tools, navigating networks, operating computers, coordinating actions, and discovering things humans have missed. Then we are told that we need to prepare for the resulting risks.

Who exactly is "we"? The maintainer of some obscure but critical open-source dependency? The engineer responsible for infrastructure at a 50-person company? A hospital IT department? A municipal government? A developer who happens to own a repository that ten thousand other applications quietly depend upon?

They didn't build the frontier models. They didn't decide how quickly capabilities should advance. They didn't participate in the race. But increasingly, they are being told that they must harden their systems against the consequences.

That is an extraordinary transfer of responsibility. AI companies should not get to count increased capability as their achievement while treating the resulting danger as everyone else's adaptation problem.

## Alignment is not an excuse

This becomes particularly uncomfortable when the systems themselves behave in unexpected ways. OpenAI and other frontier labs spend enormous resources researching alignment, containment, model behavior and safeguards precisely because increasingly capable models do not always behave as intended.

That work is necessary. But difficulty is not absolution. If you build a powerful system and cannot reliably predict or constrain its behavior, the uncertainty does not somehow become the public's responsibility.

The standard has to be higher. Demonstrate that safeguards can keep pace with capabilities. Submit those claims to meaningful independent scrutiny. And when they cannot keep pace, slow down.

Defensive products cannot substitute for that obligation. Neither can grants. Neither can API credits. Neither can a beautifully designed webpage announcing another initiative.

## Open source is where this gets frightening

Open source makes the problem particularly acute. Modern software is not a collection of isolated applications. It is an enormous interconnected dependency graph: one package depends on another package, which depends on another library, which eventually contains something maintained by three people in Nebraska, Helsinki or Hyderabad who have day jobs.

That architecture is one of humanity's great technological achievements. It is also an extraordinary attack surface.

An AI agent does not necessarily need to break into ten thousand companies individually. It may only need to compromise something those ten thousand companies trust. And increasingly capable AI systems can potentially examine repositories, dependencies, permissions, contributor histories and infrastructure simultaneously — searching not merely for a vulnerable line of code, but for combinations of weaknesses across an entire system.

That changes the economics of attack. The defender has to notice the vulnerability. The attacker only has to find it once. Now give the attacker machine-scale patience.

That should scare us.

## "Maintainers should review more carefully" is not a strategy

The traditional answer to software supply-chain security is essentially vigilance. Review the pull request. Check the dependency. Watch the contributor. Run another scanner. Configure another security product. Read another advisory.

For a volunteer maintainer already drowning in issues and pull requests, this advice borders on absurdity. Humans cannot manually defend machine-scale infrastructure against machine-scale adversaries, and they should not be expected to.

If frontier AI dramatically increases offensive capability, then frontier defensive capability needs to reach the people maintaining our shared infrastructure just as aggressively. Not eventually. Not after they become important enough to qualify for a special program. Not after a sales conversation. Not after an application disappears into an eligibility process.

Now.

## This is why MergeWatch is free for open source

This problem is one reason we opened MergeWatch to qualifying open-source maintainers free of charge.

We're a tiny company. We don't have a billion-dollar cyber-defense commitment, and we certainly don't have OpenAI's resources. What we do have is access to frontier models and a platform capable of putting those models directly into the pull-request workflow. So that is what we are doing.

When code enters a repository, we want capable models looking at it from the defender's side. Not replacing maintainers. Not pretending an AI review makes software safe. And certainly not claiming we've solved software supply-chain security. It is simply another capable set of eyes working for the people who are actually responsible for the code.

Because the asymmetry here is becoming ridiculous. Attackers are gaining access to increasingly intelligent systems capable of reasoning about enormous amounts of software. Defenders cannot be left with a linter and a prayer.

## Build the fire extinguishers. Then give them away.

OpenAI deserves credit for Patch the Planet. The work appears technically serious. Real vulnerabilities are being identified. Real patches are being accepted. We need much more of it.

But 41 protected open-source projects should not reassure us. It should tell us how enormous the remaining problem is.

If frontier AI companies genuinely believe — as their own cybersecurity research increasingly suggests — that AI is changing the economics of cyberattack, then they inherit a responsibility proportional to the capabilities they are creating. That means defensive AI that is cheap, boring, automatic, self-service and available at enormous scale.

Especially to open source. Especially to the obscure projects. Especially to the maintainers nobody has heard of yet whose code nevertheless sits somewhere deep inside the systems all of us depend upon.

You cannot light a bigger and bigger fire and congratulate yourself for operating an excellent fire department. And you certainly cannot hand the rest of us an application form for an extinguisher.

Build the fire extinguishers. Put them everywhere. And if you're the one making the fire more dangerous, don't expect everyone else to pay for them.
