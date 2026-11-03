---
name: haytham-brand
description: "Use when making anything that carries Haytham A. Salama's name or personal identity: a web page or site theme, a Tailwind or Nuxt UI setup, a slide deck, social card, cover, YouTube thumbnail, poster, README header, profile image, or text written in his voice in English or Arabic. Covers how to write his name and title, the handwritten signature logo, favicon and app icon, the exact colours (Ink, Paper, Iris, Azure, in hex and OKLCH) and the 95/5 colour rule, typography (Geist, Geist Mono, Instrument Serif), spacing, radius, motion, tone of voice, do and don't, and how to apply it in Tailwind 4, Nuxt UI and plain HTML. Triggers: 'my brand', 'brand kit', 'personal site', 'my signature', 'social card', 'thumbnail', 'deck', 'الهوية', 'هويتي', 'البراند', 'تصميم', 'الشعار', 'التوقيع'."
---

# Haytham brand

The personal identity of Haytham A. Salama, software engineer: one handwritten signature, black and white doing
most of the work, and two colours saved for small details. Use it for any page, deck, image or post he puts his
name on.

The canonical guide is the brand page of his site (`haythamasalama.me/brand`) and its brand kit. This skill copies
the facts from it, checked 2026-10-27. When they disagree, the site wins; tell him the skill needs an update.

## TL;DR

1. **Ink first.** Black, white and generous space carry the design. If it works without colour, it's right.
2. **The signature is the logo.** White on dark, black on light. Never retype, redraw, stretch, recolour, or add
   glows or shadows. Use the files in [assets/](assets/).
3. **Colour is a signal.** Iris `#7F7CF2` and Azure `#4F9BFF` take at most 5% of any surface: a focus ring, a badge,
   a live dot, a hairline, one gradient word.
4. **Hover and selected states stay neutral.** Links and icons hover to the brighter text colour, never to a colour.
5. **Dark is the default** (Ink `#0B0B0C`), light is optional (Paper `#FFFFFF`).
6. **Type:** Geist 400/500/600 for everything you read, Geist Mono for labels, dates and code, Instrument Serif
   italic for one human phrase per page.
7. **Voice:** plain words over jargon. Show the work before the title. Warm, never loud.
8. **Name:** Haytham A. Salama. Spelled Haytham, never Haitham.

## References and assets

| File | Read it when |
|---|---|
| [references/colors.md](references/colors.md) | you need any colour: full Iris and Azure scales, dark and light tokens, gradients, OKLCH values, contrast, code and diagram palettes |
| [references/logo.md](references/logo.md) | placing the signature, favicon or app icon; sizes, clear space, animation, misuse |
| [references/voice.md](references/voice.md) | writing any text: English and Arabic voice, words to avoid, bios, and links to the lengths, employer rules and Arabic rules |
| [references/apply.md](references/apply.md) | building it: Tailwind 4 tokens, Nuxt UI mapping, plain HTML and CSS, social card and thumbnail layouts |
| [assets/](assets/) | signature SVGs (white, black, gradient, each with a heavier "small" cut), favicon SVGs, app icon, `favicon.ico`, `apple-touch-icon.png`, `haytham-brand-tokens.css` |

## Name and title

| Item | Use |
|---|---|
| Full name | **Haytham A. Salama** |
| Short | **Haytham** |
| Title | **Senior Software Engineer · SaaS, AI, FinTech & Logistics** |
| Handle | `@haythamasalama` (GitHub, X, LinkedIn, Medium) |
| Website | `haythamasalama.me` |

- On Arabic pages the name stays in Latin letters, as in his Arabic product pages. Ask him before using an Arabic
  spelling.
- The title uses a middle dot (`·`) and an ampersand. Sentence case in running text: "senior software engineer".
- Social cards and covers set the name in Geist 600 with slight negative tracking, the title in muted grey below it,
  and the domain in Geist Mono.

## The signature

- Files: `haytham-signature-white.svg` (for dark), `haytham-signature-black.svg` (for light), and
  `-small` versions with a heavier stroke for anything under 120 px wide. The gradient version is for artwork
  (covers, thumbnails, posters) only.
- Minimum size: 56 px on screen, 18 mm in print.
- Clear space: a quarter of its width, empty, on every side.
- One colour in any interface, hover included.
- Never on a busy background or a photo without a calm, solid area behind it.

Details, favicon rules and the stroke-by-stroke animation: [references/logo.md](references/logo.md).

## Colour

| Name | Hex | OKLCH | Role |
|---|---|---|---|
| Ink | `#0B0B0C` | `oklch(15.0% 0.002 286.1)` | page, dark theme |
| Surface | `#131316` | `oklch(18.8% 0.006 285.8)` | tiles, hover |
| Line | `#1F1F23` | `oklch(24.1% 0.008 285.8)` | borders, dividers |
| Text | `#EDEDEF` | `oklch(94.7% 0.003 286.3)` | text on Ink (about 16.8:1) |
| Muted | `#A1A1AA` | `oklch(71.2% 0.013 286.1)` | secondary text on Ink (about 7.7:1) |
| Faint | `#85858F` | `oklch(62.0% 0.015 286.0)` | labels and meta on Ink (about 5.4:1) |
| Paper | `#FFFFFF` | `oklch(100% 0 0)` | page, light theme |
| Iris 500 | `#7F7CF2` | `oklch(64.5% 0.172 281.6)` | "the creative": the designer and video editor before the code |
| Azure 500 | `#4F9BFF` | `oklch(68.8% 0.166 256.2)` | "the engineer": clear, calm, trusted with money |

- **The 95/5 rule:** about 70% Ink, 25% white, greys and the signature, never more than 5% Iris + Azure.
- **Signature gradient:** `linear-gradient(90deg, #7F7CF2, #6C8CF9, #4F9BFF)` (Iris 500 to Azure 500).
- **Shades:** 300–500 for details on dark; 600–700 for details on white and for buttons with white text.
- Hex is the source of truth. The OKLCH values are computed from it for tools that want OKLCH.

Full scales, light-theme tokens and the code and diagram palettes: [references/colors.md](references/colors.md).

## Typography

| Face | Weights | Use |
|---|---|---|
| Geist | 400, 500, 600 | headings and everything you read |
| Geist Mono | 400, 500 | labels, dates, repository names, code, eyebrows |
| Instrument Serif | 400 italic | one human phrase per page, often with the gradient |
| Excalifont | 400 | labels inside hand-drawn diagrams only |

- Headings are semibold (600) with negative tracking: about `-0.03em` at 44 px, `-0.01em` at 17 px.
- Body text is 15–17 px with line height 1.7. Small text 13–14 px.
- Eyebrow labels: Geist Mono 12 px, 500, uppercase, tracking `0.08em`, in Faint.
- Paragraphs stop at 70 characters per line.
- All faces are self-hosted (Fontsource) on the site. Google Fonts has Geist, Geist Mono and Instrument Serif for
  quick pages.

## Spacing, radius and layout

- Generous space. Sections are about 72 px apart; cards have 18–22 px of padding; grid gaps are 12–16 px.
- Page column 880 px, a wide page 1040 px, long-form reading 720 px.
- Radius: badges 6 px, list rows and buttons 8–12 px, cards 14–16 px, hero frames 22 px, app icon about 23% of its
  size.
- Borders are 1 px in Line. Cards are flat: no drop shadows.
- Tap targets are at least 44 px.
- Below 600 px wide, wide figures scroll sideways inside their card instead of shrinking their labels.

## Motion

- One curve: `cubic-bezier(0.23, 1, 0.32, 1)`, 200 ms for colour and border changes.
- Entrances rise 8 px and fade in over 0.7 s. The live dot pulses an Iris ring every 2.2 s.
- The signature draws itself stroke by stroke on a home or hero screen only.
- Every animation stops under `prefers-reduced-motion`.

## Voice in short

- Plain words, short sentences, one idea per paragraph. First person for his own work, "the team" for shared work.
- No marketing words and no unmeasured claims.
- English: British spelling in new text, sentence-case headings.
- Arabic: Modern Standard Arabic, short and plain, technical names in Latin letters, with Latin digits.

Full rules and bios: [references/voice.md](references/voice.md).

## Do and don't

| Do | Don't |
|---|---|
| Let black, white and space carry the layout | Fill backgrounds, buttons or large areas with Iris or Azure |
| Use the signature files as they are | Retype the name in a script font as a "logo" |
| Keep the signature one colour in UI | Use the gradient signature on a site header or on hover |
| Put colour on a focus ring, badge, live dot, hairline or one word | Colour links, hover states or the current nav item |
| Show tools and company logos in one soft colour on a Surface tile | Mix full-colour logos, or add framework icon chips to project cards |
| Show GitHub avatars and photos of logos in greyscale | Put the signature on a photo or pattern |
| Use one gradient word per page at most | Add glows, drop shadows or 3D effects |
| Write what he did, plainly | Claim a teammate's work, or publish employer internals |

## Before you finish

- [ ] The signature is an untouched file, one colour, with clear space, at 56 px or larger.
- [ ] Iris and Azure cover about 5% of the surface or less; hover and selected states are neutral.
- [ ] Only Geist, Geist Mono and (once) Instrument Serif italic.
- [ ] Text passes contrast: Text, Muted or Faint on Ink; Ink, `#3F3F46`, `#52525B` or `#6B6B74` on Paper.
- [ ] Name spelled "Haytham A. Salama"; title as above.
- [ ] Copy follows [references/voice.md](references/voice.md); nothing internal to an employer or client.
- [ ] Looked at in dark and light, and at 375 px wide for pages.
