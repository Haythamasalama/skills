# Voice

How Haytham's words sound, in English and Arabic. Checked 2026-10-27. His readers include CEOs,
CTOs, engineers and recruiters; write so all of them follow.

This file is the home of his voice, the words to avoid, the employer rules and the lengths of short
texts. They hold for his site, his posts and his articles alike.

## The voice in one line

**Plain words over jargon. Show the work before the title. Warm, never loud.**

## Rules for both languages

- Short sentences. One idea per paragraph.
- First person for his own work ("I designed and built..."). "The team" for shared work.
- If a sentence still works without the adjective, drop the adjective.
- Headings say plainly what the section is ("The integration engine", not "One engine to rule them all").
- Technical depth (how it is built, step by step) belongs in articles, not on project pages or cards.

## English

- British spelling in new text: colour, behaviour, organisation, authorise. Don't churn existing
  pages to change it.
- Sentence case for headings and buttons.
- Meta lines use a middle dot: `Founder · 2026 – now`, `SaaS, AI, FinTech & Logistics`.
- Avoid marketing words: cutting-edge, seamless, robust, blazing, revolutionary, world-class, leverage, empower,
  unlock, game-changing, next-level, supercharge.
- Avoid AI-sounding filler: "In today's fast-paced world", "It's worth noting", "Let's dive in", groups of three
  added for rhythm, a closing line that repeats the post. The `humanizer` skill (if installed) checks a draft.

## Arabic

Register: simple modern standard Arabic (فصحى بسيطة): not classical, not dialect; the everyday word
over the literary one; technical names stay in Latin letters; one fixed term per concept. On top of that:

- Numbers in Latin digits (30 يوماً، 6 ساعات), as in his Arabic product copy.
- First person for his own work: «صممتُ وبنيتُ ...». Shared work: «الفريق».
- Avoid exaggeration: ثوري، لا مثيل له، الأفضل على الإطلاق، سلس تماماً، قوي جداً، نقلة نوعية، متكامل وشامل.
- Example of the tone:
  - «اعرف أداء كل قالب وتكلفته في جميع حساباتك. يعمل على جهازك، ولا يغادره رمز الوصول أبداً.»
  - Not: «منصة ثورية متكاملة تمنحك تجربة سلسة لا مثيل لها في إدارة قوالبك.»

## Bios

Short bio (about 40 words, from the brand page):

> Haytham A. Salama is a senior software engineer who builds SaaS, logistics and fintech platforms. He contributes
> to Nuxt UI, writes about shipping software, and works every day alongside AI coding agents.

Long bio (about 80 words; the brand page version also names his current employer and his own product, so take
those from the site when they are needed):

> Haytham A. Salama is a senior software engineer who has been shipping software since 2016. He designs systems
> around the domain, builds the APIs, integrations and security they run on, and leads small teams that take them to
> production. Before code, he repaired electronics and worked as a designer and video editor, which still shapes how
> his software feels. He has contributed to Laravel, Nuxt and Nuxt UI, and works every day alongside AI coding agents.

Write bios in the third person. Posts and his own pages use the first person.

## Honesty

- Every claim can be traced to code, git history or a measurement. If it can't, ask; don't invent it.
- Say exactly what he did: "I designed and built X", "I built the foundation of X; the team grew it".
- No unmeasured outcomes ("3× faster" only when it was measured).

## Employers and clients

These hold for every past and future employer or client.

- **No internal counts**: files, pages, components, releases, endpoints, pull-request sizes.
- **Growing counts are "more than N"** ("more than 50 domains"): the real number will change.
- **No dated internal milestones** ("in February we added…"). Public facts such as job dates are fine.
- **No long lists of vendors or internal tools.** Describe integrations by category (payment gateways,
  AI models, messaging). Don't name the AI tooling vendor; say "AI coding agents".
- **Colleagues:** "the team" on the site; named only where they agreed, as contributors.
- **Never publish:** secrets, hostnames, endpoint paths, database schemas, permission keys,
  rate-limit numbers, known weaknesses, pricing, customer or personal data.
- **Screenshots and code:** none of employer or client products unless he asks; short snippets typed
  fresh, never copied from a company's code.

## Lengths

| Text | Length |
|---|---|
| page or article `description` (search, link previews) | 120–220 characters |
| project card description | one sentence, about 80–160 characters |
| paragraph | two or three sentences |
| figure caption | one sentence that says what to notice |
| LinkedIn post | under about 1,300 characters |
| LinkedIn project description | under 2,000 characters |

## Checks before publishing

- [ ] Read it aloud. Anything that sounds like an advert gets rewritten.
- [ ] Every claim can be traced to code, history or a measurement.
- [ ] Name, title and handle are spelled as in [../SKILL.md](../SKILL.md).
- [ ] Arabic text is simple فصحى, with Latin digits.
- [ ] Nothing from the "Never publish" list above.
