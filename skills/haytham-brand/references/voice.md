# Voice

How Haytham's words sound, in English and Arabic. Checked 2026-10-27. His readers include CEOs,
CTOs, engineers and recruiters; write so all of them follow.

This file is the home of his voice and of the words to avoid. Two other skills hold rules that apply
to all of his text, and this file does not repeat them:

- exact attribution, checkable claims, what never to publish about an employer or client, and the
  lengths of cards, descriptions, captions and alt text:
  [tech-articles writing rules](../../tech-articles/references/writing-rules.md);
- Arabic register, wording, punctuation and the terms that stay in Latin letters:
  the [arabic-copy](../../arabic-copy/SKILL.md) skill.

LinkedIn posts and X threads follow `linkedin-posts` on top of this voice.

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

On top of `arabic-copy`:

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

## Lengths and employer rules

Both live in [tech-articles writing rules](../../tech-articles/references/writing-rules.md#lengths)
and hold for his site, his posts and his articles alike. LinkedIn post length: `linkedin-posts`.

## Checks before publishing

- [ ] Read it aloud. Anything that sounds like an advert gets rewritten.
- [ ] Every claim can be traced to code, history or a measurement.
- [ ] Name, title and handle are spelled as in [../SKILL.md](../SKILL.md).
- [ ] Arabic text passes `arabic-copy`, with Latin digits.
- [ ] Nothing from the [employer "Never publish" list](../../tech-articles/references/writing-rules.md#employers-and-clients).
