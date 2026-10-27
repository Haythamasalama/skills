---
name: tech-articles
description: Use when writing about your own engineering work — a technical deep dive ("how I designed X"), a short project story, or a project case study page with a fixed structure (overview, the problem, the solution, what I did, what it offers, system design, in the product) — and when drawing hand-drawn, Excalidraw-style figures that work in light and dark themes, preparing screenshots, or repurposing an article into Medium, X and LinkedIn posts or a LinkedIn Projects entry. Triggers include "write an article", "deep dive", "case study", "project page", "draw a diagram for the post", "turn this into a LinkedIn post / X thread", «اكتب مقال», «دراسة حالة», «منشور لينكدإن».
---

# Technical articles, case studies and their figures

For writing about work you did: what was built, why, what it cost and what it changed. Readers
include CEOs, CTOs, engineers and recruiters, so every piece must read for all of them. The method
here was refined on a personal engineering site; it carries no site code.

## TL;DR

- **Pick the shape first.** A deep dive teaches how something works. A case study shows the goal,
  your role, what you did and the result, and links to deep dives for the mechanics. Don't mix them.
- **Show more, write less.** Lead each section with a picture (a figure, a screenshot, a photo).
  Two or three sentences a paragraph, one line a bullet.
- **Every claim is verifiable.** Check the code and git history before you write; ask the owner
  about anything the code doesn't show.
- **Say exactly who did what.** "I designed and built X"; "the team writes the integrations; I built
  the engine they run on". Never claim a teammate's work.
- **Employers and clients:** no internal counts (write "more than N"), no dated internal milestones,
  no vendor lists, no secrets or internals, no screenshots unless asked.
- **Figures:** one idea each, hand-drawn style, a fixed palette that maps to theme tokens, checked in
  both themes and at 375px. Never AI-generated diagrams.
- **Social posts come after the article**, are honest about what they link to, and reuse its figures.

## Pick the shape

| Shape | Job | Length | Structure |
|---|---|---|---|
| Deep dive | how a system was designed, why, and what it cost | 800–1,500 words | situation → design (figure first) → decisions and trade-offs → what changed and what's next → link to the case study |
| Project story | one angle of a project, told as a story | 500–900 words | hook from the real problem → the idea that solved it → one or two figures → result → link |
| Case study page | goal, role, contribution and results for one project | 700–1,000 words | the fixed sections below |

Give a project a case study only when there is a system to explain: architecture, a non-trivial
flow, integrations, hardware. Early or small work stays a one-line card. When unsure, ask.

### The deep dive

1. **The situation and the constraint**, in a short paragraph.
2. **The design**: the figure first, then how the pieces fit.
3. **The decisions and their trade-offs**, including what was rejected and why.
4. **What it changed**, and what the next version would do differently.
5. **A link to the case study.**

Show patterns with short snippets typed fresh for the article, never code copied from an
employer's repository. Fence code with a language and a file name.

### The case study

**A case study is not an article.** It shows the goal, your role, what you did, how it helped the
team and the results. Keep each technical part to one short paragraph about what it is and what it
made possible. Configuration steps, request flows and field-by-field walkthroughs belong in a deep
dive that the page links to. If a paragraph reads like a tutorial, cut it to its outcome.

The fixed sections, in this order:

1. **Overview**: what the product is, who uses it, your role and when you joined. Three or four
   sentences.
2. **The problem**: the problems **you** faced in your role, not the company's business. One intro
   line, then three to five bullets, each with a bold lead-in.
3. **The solution**: a before/after figure first, then one short paragraph per problem, each with a
   bold lead-in that matches its problem.
4. **What I did**: bullets with exact attribution (built, designed, led, proposed, maintain), and
   leadership and reviews.
5. **What it offers**: six to eight product capabilities, a two-to-five-word title and one sentence
   each. The company's public site is a good source.
6. **System design**: an architecture figure and one paragraph, then subsections in the order of the
   problems, each with a figure or two or three short paragraphs.
7. **In the product**: screenshots and photos, only for your own products or where the owner asked.
8. Optional extra sections (for example "AI in the engineering workflow"): a figure, one paragraph
   on the goal and what you set up, then "what it changed" bullets.

Aim for three to six figures on a full page. Template and section rules:
[references/case-study.md](references/case-study.md).

## Research before writing

- Read the source repositories, docs and ADRs, and the company's public pages.
- Measure authorship per module with git (`git shortlog -sne --all`; `git log --author=<name> --
  <path>` against the total for that path). A local repo may be a partial copy of the real product.
- **List the claims you plan to make**, and confirm with the owner anything the code doesn't show.
  Don't drop a claim silently and don't invent one.

## Voice

Plain words over jargon; first person for your own work, "the team" for shared work; short
sentences, one idea per paragraph; headings in sentence case that say what the section is ("The
integration engine", not "One engine to rule them all"); no marketing words and no AI filler. Full
rules, the banned-word list and the lengths table: [references/writing-rules.md](references/writing-rules.md).

## Figures

Hand-drawn, Excalidraw-style, one idea per figure, little text, icons and small people, and one
highlighted path. Written as code with `scripts/excalidraw-scene.mjs`, saved as plain `.excalidraw`
files, rendered to SVG with colours mapped to theme tokens so they follow light and dark. Method,
palette, layout rules, preview and export: [references/figures.md](references/figures.md).

## Screenshots

WebP, 1760px wide, a themed pair (`-light`/`-dark`) where the product has both, demo data where
possible, personal data blurred before export. Mockups of several screens follow one layout.
Details: [references/screenshots.md](references/screenshots.md).

## Social posts

After the article is published: a Medium import (keeps the canonical link), an X thread of five to
eight posts, a LinkedIn post, and for a case study a LinkedIn Projects entry under 2,000 characters.
Templates: [references/social-posts.md](references/social-posts.md). Keep drafts out of the
repository.

## Before you finish

- Lint and build pass, and the page appears in the build output and on its index page.
- Read the page at desktop and 375px, in both themes. No figure overflows.
- The reading time matches the word count (about 230 words a minute).
- Every number and name is checked against the employer rules.
- Tell the owner what you verified, what came from them, and what still needs their confirmation.
