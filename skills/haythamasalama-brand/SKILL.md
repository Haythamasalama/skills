---
name: haythamasalama-brand
description: "Use when making anything that carries Haytham A. Salama's name or personal identity: a web page, site or app theme, a Tailwind 4, Nuxt or Nuxt UI setup, a header or footer, a slide deck, social card, share image, YouTube thumbnail, cover, poster, README header, or text written in his voice in English or Arabic. Covers his name and title, the handwritten signature and its drawing animation, favicon and app icon, the exact colours (Ink, Paper, Iris, Azure, light and dark tokens, hex and OKLCH) and the 95/5 rule, typography (Geist, Geist Mono, Instrument Serif), layout, radius, motion, a copy-ready tokens CSS file and component templates that match his site, and tone of voice. Triggers: 'my brand', 'brand kit', 'personal site', 'my signature', 'social card', 'thumbnail', 'deck', 'الهوية', 'هويتي', 'البراند', 'تصميم', 'الشعار', 'التوقيع'."
metadata:
  tags: design, brand
---

# Haytham A. Salama brand

**Read when:** you make a page, app, image, deck or text that carries Haytham A. Salama's name.
**Owns:** his name and title, the brand rules in short, the asset list, and where each detail lives.

The personal identity of Haytham A. Salama, software engineer: one handwritten signature, black and white doing
most of the work, and two colours saved for small details. The source of truth is his site, `haythamasalama.me`,
and its brand page, `haythamasalama.me/brand`. This skill matches the site's code, checked 2026-11-03. When they
disagree, the site wins; tell him the skill needs an update.

## TL;DR

1. **Ink first.** Black, white and generous space carry the design. If it works without colour, it's right.
2. **The signature is the logo.** White on dark, black on light, one colour in every interface. Never retype,
   redraw, stretch, recolour, or add glows or shadows. The gradient file is for artwork only.
3. **Colour is a signal.** Iris `#7F7CF2` and Azure `#4F9BFF` take at most 5% of any surface: a focus ring, a
   badge, a live dot, a hairline, one gradient word.
4. **Hover and selected states stay neutral.** Links and icons go to the brighter text colour, never to a colour
   or a gradient, the signature included.
5. **Dark is the default** (Ink `#0B0B0C`); light (Paper `#FFFFFF`) is a choice made with `class="light"`.
6. **Type:** Geist 400/500/600 for everything you read, Geist Mono for labels, dates and code, Instrument Serif
   italic for one human phrase per page.
7. **Build from the tokens file.** Copy `assets/haythamasalama-brand-tokens.css`; use its tokens (`bg`, `fg`,
   `muted`, `line`...), never raw hex, in anything with a theme.
8. **Voice:** plain words over jargon. Show the work before the title. Warm, never loud.

## Name and title

| Item | Use |
|---|---|
| Full name | **Haytham A. Salama**, spelled Haytham, never Haitham |
| Short | **Haytham** |
| Title | **Senior Software Engineer · SaaS, AI, FinTech & Logistics** |
| Handle | `@haythamasalama` (GitHub, X, LinkedIn, Medium) |
| Website | `haythamasalama.me` |

- The title uses a middle dot and an ampersand. In running text and on the social card it is sentence case:
  "Senior software engineer · SaaS, AI, FinTech & Logistics".
- On Arabic pages the name, handle and domain stay in Latin letters.
- The site's page titles read `<Page> · Haytham A. Salama`.

## Starting a new page or app

1. Copy `assets/haythamasalama-brand-tokens.css` into the project and wire it in for the stack
   ([references/code.md](references/code.md)).
2. Load Geist, Geist Mono and Instrument Serif
   ([references/typography-layout.md](references/typography-layout.md#loading-the-fonts)).
3. Copy the favicon files and set `theme-color` `#0B0B0C` ([references/logo.md](references/logo.md#favicon-and-app-icon)).
4. Build the shell from the header, footer and page header templates
   ([references/components.md](references/components.md)): 880 px column, 24 px gutters, signature home link.
5. Write the copy in his voice ([references/voice.md](references/voice.md)).
6. Check it in dark and light, and at 375 px wide.

## Assets

| File | What it is |
|---|---|
| `haythamasalama-brand-tokens.css` | copy-ready CSS: scales, light and dark tokens, base styles, utilities, animations |
| `haythamasalama-signature-white.svg`, `-black.svg` | the signature for dark and light backgrounds, 120 px and up |
| `haythamasalama-signature-white-small.svg`, `-black-small.svg` | heavier stroke for under 120 px |
| `haythamasalama-signature-gradient.svg`, `-gradient-small.svg` | Iris to Azure, for artwork only |
| `haythamasalama-signature-strokes.json` | the strokes in writing order, for the drawing animation |
| `haythamasalama-favicon.svg`, `haythamasalama-favicon-16.svg` | tab icons, 32 px and up, and 16 px |
| `haythamasalama-app-icon.svg` | 192 px app and avatar icon |
| `favicon.ico`, `apple-touch-icon.png` | browser fallback and iOS home-screen icon, under the names browsers expect |

All are in [assets/](assets/).

## Where each topic lives

| Need | File |
|---|---|
| Any colour: scales, light and dark tokens, gradients, where colour may go, contrast, code and diagram palettes | [references/colors.md](references/colors.md) |
| Fonts and loading them, type scale, page widths, spacing, radius, motion | [references/typography-layout.md](references/typography-layout.md) |
| Signature rules, drawing animation, favicon, app icon, logos beside the signature | [references/logo.md](references/logo.md) |
| Writing in his voice, English and Arabic, words to avoid, bios | [references/voice.md](references/voice.md) |
| Tailwind 4, dark mode, long-form text, Nuxt UI, a plain HTML page | [references/code.md](references/code.md) |
| Header, footer, theme toggle, copy button, filter chips, page header, badges, cards | [references/components.md](references/components.md) |
| Social card, page share image, thumbnail, slides, covers, README header | [references/artwork.md](references/artwork.md) |

## Before you finish

- [ ] The signature is an untouched file or the stroke data, one colour, with clear space, 56 px or larger.
- [ ] Iris and Azure cover about 5% of the surface or less; hover, current and selected states are neutral.
- [ ] Only Geist, Geist Mono and (once) Instrument Serif italic.
- [ ] Themed UI uses the tokens, not raw hex; the focus ring shows on every link and button.
- [ ] Text passes contrast (pairs in [references/colors.md](references/colors.md#contrast-computed-wcag-2)).
- [ ] Name spelled "Haytham A. Salama"; title as above.
- [ ] Copy follows [references/voice.md](references/voice.md); nothing internal to an employer or client.
- [ ] Animations stop under `prefers-reduced-motion`.
- [ ] Looked at in dark and light, and at 375 px wide for pages.
