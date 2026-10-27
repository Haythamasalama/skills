# Voice

How Haytham's words sound, in English and Arabic, and what never goes into them. Checked 2026-10-27.
His readers include CEOs, CTOs, engineers and recruiters; write so all of them follow.

## The voice in one line

**Plain words over jargon. Show the work before the title. Warm, never loud.**

## Rules for both languages

- Short sentences. One idea per paragraph.
- First person for his own work ("I designed and built..."). "The team" for shared work.
- Say exactly what he did:
  - "I designed and built X."
  - "I built the foundation of X; the team grew it."
  - "The team writes the integrations; I built the engine they run on."
- Never claim a teammate's work.
- Every claim can be checked. No outcome that was not measured ("3× faster" only with a measurement). An outcome
  that follows from the mechanism is fine ("reviews focus on design because formatting is checked first").
- If a sentence still works without the adjective, drop the adjective.
- Headings say plainly what the section is ("The integration engine", not "One engine to rule them all").
- Technical depth (how it is built, step by step) belongs in articles, not on project pages or cards.

## English

- British spelling in new text: colour, behaviour, organisation, authorise.
- Sentence case for headings and buttons.
- Meta lines use a middle dot: `Founder · 2026 – now`, `SaaS, AI, FinTech & Logistics`.
- Avoid marketing words: cutting-edge, seamless, robust, blazing, revolutionary, world-class, leverage, empower,
  unlock, game-changing, next-level, supercharge.
- Avoid AI-sounding filler: "In today's fast-paced world", "It's worth noting", "Let's dive in", groups of three
  added for rhythm, a closing line that repeats the post.

## Arabic

- Modern Standard Arabic (فصحى), short and plain. No dialect.
- Rewrite the idea; don't translate the English word for word.
- Product names, technical terms and identifiers stay in Latin letters inside the Arabic sentence: GitHub, Docker,
  API, Nuxt, MIT. Expand an acronym the first time if the reader may not know it.
- His name stays in Latin letters: Haytham A. Salama. Ask him before using an Arabic spelling.
- Numbers in Latin digits (30 يوماً، 6 ساعات), as in his Arabic product copy.
- Arabic punctuation: the comma «،» and the question mark «؟».
- First person for his own work: «صممتُ وبنيتُ ...». Shared work: «الفريق».
- Avoid exaggeration: ثوري، لا مثيل له، الأفضل على الإطلاق، سلس تماماً، قوي جداً، نقلة نوعية، متكامل وشامل.
- Avoid stacked synonyms and long openings («في ظل التطور المتسارع الذي يشهده العالم...»). Start with the point.
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

## Lengths

| Text | Length |
|---|---|
| Project card description | one sentence, about 80–160 characters |
| Page description (SEO, link previews) | 150–220 characters |
| Feature grid item | a title of 2–5 words, then one sentence |
| Figure caption | one sentence that says what to notice |
| Image or figure `alt` | the whole picture in words: boxes, arrows, outcome |
| LinkedIn post or project description | under 2,000 characters |

## Employers and clients

Never publish anything internal to a current or past employer or client:

- No internal counts (files, pages, components, endpoints, releases, pull-request sizes).
- Growing counts are written as "more than N", since the real number changes.
- No dated internal milestones ("in February we added...").
- No long lists of vendors or internal tools; describe integrations by category (government services, payment
  gateways, AI models, messaging). Name a public platform only when it explains what the product does.
- Don't name the AI tooling vendor: say "AI coding agents".
- Don't name frameworks in project copy; describe the design instead. Articles may name them.
- Colleagues are "the team" on the site; name them only where they agreed, as contributors.
- Never: secrets, hostnames, endpoint paths, database schemas, permission keys, rate limits, crypto parameters,
  known weaknesses, pricing, or customer and personal data.
- Screenshots of employer or client products only when he asks. Diagrams explain the work instead. His own products
  use demo data.
- Keep claims modest, so former teams are not upset.

For a full Arabic copy review use the `arabic-copy` skill; for LinkedIn posts and X threads, `linkedin-posts`.
Both apply on top of this voice.

## Checks before publishing

- [ ] Read it aloud. Anything that sounds like an advert gets rewritten.
- [ ] Every claim can be traced to code, history or a measurement.
- [ ] Name, title and handle are spelled as in [../SKILL.md](../SKILL.md).
- [ ] Arabic text is فصحى, with Latin names and digits, and Arabic punctuation.
- [ ] Nothing from the "Never" list above.
