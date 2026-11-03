# Artwork

**Read when:** you make an image rather than a page: a social card, a page share image, a video thumbnail, slides,
a cover or poster, or a README header.
**Owns:** the fixed layouts for each, their sizes, and where the signature, portrait and colour sit in them.

Measured from the site's social card, share images and thumbnail specimen (checked 2026-11-03). Artwork has no
theme, so it uses raw hex: Ink `#0B0B0C`, text `#EDEDEF`, muted `#A1A1AA`, faint `#85858F`.

## TL;DR

- Ink background, black and white first; colour only on one hairline or one badge.
- The white signature sits at the top end corner; the gradient signature is allowed only in artwork.
- Name in Geist 600 with slight negative tracking, title in muted grey, domain in Geist Mono.
- Sizes are shares of the width, so a layout scales to any export size.

## Social card (1200 × 630)

The site's main share image (`og.png`).

- Ink background. When it is shown inside a page: 1 px `#1F1F23` border, 14 px radius.
- A 2 px `--gradient-signature` hairline across the full top edge.
- Padding 7%.
- Top start: the round portrait, 14% of the width.
- Top end: the white signature, 30% of the width, 6% from the top, 5% from the side, 90% opacity.
- Bottom start, stacked with 1% gaps:
  - the name, Geist 600, 5.67% of the width, line height 1.05, tracking `-0.02em`, `#EDEDEF`;
  - the title, 2.67%, `#A1A1AA`: "Senior software engineer · SaaS, AI, FinTech & Logistics";
  - the domain, Geist Mono, 2.33%, `#85858F`: `haythamasalama.me`.
- No other colour.

## Page share image (1200 × 630)

Each page's own share image, drawn at build time with the page's title.

- Ink background, a 5 px hairline on top: `linear-gradient(90deg, #7F7CF2, #4F9BFF)`.
- Padding 64 px top, 84 px sides, 72 px bottom. Top row and title block pushed apart (`justify-between`).
- Top start: an eyebrow saying what the page is ("Project", "Article · Laravel", "Tools"): Geist Mono 24 px,
  uppercase, tracking `0.08em`, `#A1A1AA`.
- Top end: the white signature, 240 × 122 px.
- Bottom: the title, Geist 600, 64 px, line height 1.1, tracking `-0.02em`, `#EDEDEF`, at most two lines; the
  description 24 px below it, 28 px, line height 1.45, `#A1A1AA`, at most two lines; the domain 32 px below that,
  Geist Mono 24 px, `#71717A`.

## Video thumbnail (16:9)

- Ink background, padding 6%. Black and white only; colour only on the badge.
- Top row:
  - start: a badge with a small dot and a word (LIVE, NEW): Geist Mono about 1.9% of the width (10 px minimum),
    tracking `0.1em`, a 1 px Iris 500 → Azure 500 gradient border, radius 1% of the width; the dot is about 1.1% wide
    with the 135° status-dot gradient;
  - end: an episode label, `EP. 01`, Geist Mono, same size, `#85858F`.
- Middle: the title, Geist 600, 7.4% of the width, line height 1.05, tracking `-0.03em`, at most 80% wide.
- Bottom row: a round portrait (4.6% of the width) and "with Haytham" (2.2%, `#A1A1AA`) at the start; the white
  small signature, 12% of the width, at the end.

## Slides

- Ink slides with white text and the site's type scale: titles Geist 600 with negative tracking, body at 15–17 px
  equivalent with line height 1.6–1.7, labels as eyebrows (Geist Mono, uppercase, `0.08em`).
- Title slide: the name, the title, and either one gradient word or the gradient signature. Nothing else.
- One idea per slide. Diagrams use the palette in [colors.md](colors.md#diagrams); code uses the brand code
  palette on `#0F0F11`.
- Last slide: the white signature, the handle `@haythamasalama` and the domain, in Geist Mono.

## Covers and posters

- The social card's rules, scaled to the format: Ink, generous space, the name in Geist 600.
- This is where the gradient signature file belongs, once, at a size where its clear space fits.
- For print, the signature is at least 18 mm wide.

## README header

Not on the site; built from the signature rules. The signature, centred, in one colour that follows GitHub's
light or dark theme:

```html
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/haythamasalama-signature-white.svg">
    <img src="assets/haythamasalama-signature-black.svg" alt="Haytham's handwritten signature" width="160">
  </picture>
</p>
```

- Under it, one plain line saying what the project does, written in his voice.
- Copy the two SVGs into the repository; the paths are relative to the README.
