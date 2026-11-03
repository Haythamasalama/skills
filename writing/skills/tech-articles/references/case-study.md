# The case study page

## Two parts: the card and the page

- **The card** lists the project everywhere (a projects index, a "selected work" strip): a title
  as "Name · what it is", a period, a role and period line (`Senior Software Engineer · Feb 2023 –
  now`), a one-sentence description (80–160 characters, what was built plus your part), a logo or
  mark, and links. No technology chips. Small client sites can share one card.
- **The page** exists only when there is a system to explain. Its front matter needs only a
  `description` (150–220 characters) for search and link previews; the title, period and links
  come from the card.

A useful index layout: a headline with chips for the companies and products you built at, then
"Building now" (the newest project still running), "Case studies" (projects with a page), and
"Earlier and smaller projects" (cards without a page).

## Show more, write less

Most visitors don't read long text. Keep the page to about 700–1,000 words and let pictures carry
the detail:

- lead every section with a picture: a figure, a product screenshot, or a real photo or drawing of
  the hardware;
- show how big a system is with a **feature map**: a figure listing every module and what it does,
  backed by screenshots, instead of paragraphs;
- two or three sentences a paragraph, one line a bullet.

## Section rules

| Section | Rules |
|---|---|
| Overview | what the product is, who uses it, your role, when you joined; three or four sentences |
| The problem | your problems in your role; one intro line, three to five bullets with bold lead-ins |
| The solution | a before/after figure first; one short paragraph per problem, bold lead-in matching it |
| What I did | exact attribution verbs; include leadership and reviews |
| What it offers | six to eight capabilities: a 2–5 word title and one sentence each |
| System design | architecture figure + one paragraph; subsections in the order of the problems; say what each part does and what it made possible; the figure carries the detail |
| In the product | screenshots and photos, only for your own products or where the owner asked; blur personal data |
| Extra sections | a figure, one paragraph on the goal and what you set up, "what it changed" bullets |

Each figure's title matches its section heading, and each has a full `alt` and a one-sentence
caption. Three to six figures on a full page.

## Template

```markdown
---
description: '<What the project is and your part, 150–220 characters.>'
---

## Overview

<What the product is and who uses it. Your role and when you joined. Three or four sentences.>

## The problem

<One line: the situation when you arrived.>

- **<Problem one.>** <What was missing or hard, in your area.>
- **<Problem two.>** <…>
- **<Problem three.>** <…>

## The solution

<figure: before-after — alt: "Before: … After: …">
<One sentence: what to notice.>

**<Problem one, as a solution.>** <Two or three sentences on what was set up.>

**<Problem two, as a solution.>** <…>

## What I did

- <Built / designed / led / proposed / maintain …, with exact attribution.>
- <…>

## What it offers

- **<Two to five words>**: <one sentence>
- <six to eight items>

## System design

<figure: architecture — alt: every box and arrow in words>
<One sentence.>

<One paragraph: the moving parts and how they talk.>

### <First subsection, in the order of the problems>

<figure, or two or three short paragraphs with bold lead-ins>

<What this part does and what it made possible for the team or the product.>

## In the product

<Only for your own products, or where the owner asked. Demo data; personal data blurred.>

<screenshot — alt: what the screen shows>
<One sentence.>
```

Use the site's own components for figures, feature grids and screenshots; the template only fixes
the order and the content of each section.

## Do and don't

Do:

- lead with goal, role and result: what was missing, what you built or led, what it changed for the
  team, the product or the business;
- name the engine or mechanism, but don't walk through it;
- keep your voice: first person, plain, specific.

Don't:

- describe the company's whole business as your problem, or a teammate's work as yours;
- list vendors, tools or frameworks;
- include internal counts, dated milestones, secrets, internals, or screenshots with private data.
