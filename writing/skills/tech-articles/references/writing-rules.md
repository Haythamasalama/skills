# Writing rules

The rules for every word in an article, a case study, a project card, a caption, alt text and the
social drafts.

## Voice

- Plain words over jargon. First person for your own work ("I designed and built…"), "the team" for
  shared work. Short sentences, one idea per paragraph; drop an adjective the sentence works without.
- Headings in sentence case say plainly what the section is.
- British spelling in new text (colour, behaviour). Meta lines use a middle dot: `Founder · 2026 – now`.
- No marketing words (cutting-edge, seamless, robust, revolutionary, world-class, leverage, unlock,
  game-changing) and no AI filler ("It's worth noting", "Let's dive in", groups of three for rhythm).
- Arabic: simple modern standard Arabic (فصحى بسيطة): not classical, not dialect; the everyday word
over the literary one; technical names stay in Latin letters; one fixed term per concept; Latin digits; no exaggeration (ثوري، لا مثيل له، نقلة نوعية).

The rules below hold for every text about the owner's work, not only articles.

## Honesty and attribution

- **Every claim must be verifiable.** Check the code and git history before you write. If the code
  doesn't show something the owner claims, ask; don't drop it and don't invent it.
- **Measure authorship**, per module:

  ```bash
  git shortlog -sne --all                       # who committed, overall
  git log --oneline --author="<name>" -- <path> | wc -l
  git log --oneline -- <path> | wc -l           # compare with the total for that path
  ```

- **Say exactly what you did:**
  - "I designed and built X."
  - "I built the foundation of X; the team grew it."
  - "The team writes the integrations; I built the engine they run on."
  - "Proposed X, led its extraction, and maintain it."
- **The problem section is your problem**, the one you faced and solved in your role, not the
  company's whole business.
- **No unmeasured outcomes.** "Reviews focus on design because formatting is checked first" follows
  from the mechanism and is fine. "Onboarding is 3× faster" is not, unless it was measured.

## Employers and clients

These hold for every past and future employer or client.

- **No internal counts**: files, pages, components, releases, endpoints, rule files, pull-request
  sizes.
- **Growing counts are "more than N"** ("more than 50 domains"): the real number will change.
- **No dated internal milestones** ("in February we added…"). Competitors read the site. Public facts
  such as job dates are fine.
- **No long lists of vendors or internal tools.** Describe integrations by category: government
  services, payment gateways, AI models, messaging. Name a public platform only where it explains
  what the product does.
- **Don't name the AI tooling vendor.** Say "AI coding agents".
- **In project cards and case-study copy about employer work, don't name frameworks.** Describe the
  design instead. (A deep dive may name the stack its snippets use.)
- **Colleagues:** "the team" on the site. Name them only where they agreed, as contributors (in
  LinkedIn drafts).
- **Keep claims modest**, so former teams aren't upset.
- **Never publish:** secrets, hostnames, endpoint paths, database schemas, permission keys,
  rate-limit numbers, crypto parameters, known weaknesses, pricing, customer or personal data.
- **Screenshots:** none of employer or client products unless the owner asks; the figures explain
  the work. Use demo data for your own products.
- **Code:** short snippets typed fresh to show a pattern, never copied from the company's code.

Your own products can go deeper, but security stays at the level of principles: no bypass details,
no edge or firewall setup.

## Lengths

| Text | Length |
|---|---|
| article `description` (search, link previews) | 120–200 characters |
| case study or site page `description` (search, link previews) | 150–220 characters |
| project card description | one sentence, about 80–160 characters: what was built and your part |
| deep dive | 800–1,500 words |
| project story | 500–900 words |
| case study page | about 700–1,000 words |
| paragraph | two or three sentences |
| bullet | one line |
| feature item | a 2–5 word title, then one sentence |
| figure caption | one sentence that says what to notice |
| figure `alt` | the whole figure in words: boxes, arrows, outcome |
| LinkedIn project description | under 2,000 characters (count it) |

## Article front matter

If the site uses Markdown with front matter, the useful fields are:

```yaml
---
title: 'How one event reaches every notification channel'
description: 'One call per event, templates per channel and language, and a guard against broken messages.'
date: '2026-10-20'          # YYYY-MM-DD
category: 'Software engineering'
readingTime: '6 min read'   # about 230 words a minute
---
```

Headings start at `##`; each becomes a shareable anchor. Images go in WebP.
