# Screenshots and mockups

## Rules

- **Format and size:** WebP, 1760px wide.
- **Themed pair** where the product has both themes: `<name>-light.webp` and `<name>-dark.webp`, and
  the page picks the one that matches. Otherwise a single image.
- **Whose product:**
  - your own products: use them, with demo data where you can;
  - employer and client products: only when the owner asks, and blur personal data before export
    (names, phone numbers, plates, emails, card and ID numbers) unless the owner says otherwise;
  - crop away whole areas that are mostly personal data, such as customer lists.
- **Look at every exported image before you publish it.**

## Blurring regions

With `sharp` (install it in a scratch folder: `npm install sharp`). Composite first, then resize in
a second pass: sharp runs `resize` before `composite` in one pipeline, which would misplace the
blurred patches.

```js
import sharp from 'sharp';

const input = 'in.png';
const regions = [
  { left: 120, top: 340, width: 420, height: 60 },   // in the original image's pixels
];

const patches = await Promise.all(regions.map(async (r) => ({
  input: await sharp(input).extract(r).blur(18).toBuffer(),
  left: r.left,
  top: r.top,
})));

const blurred = await sharp(input).composite(patches).toBuffer();
await sharp(blurred).resize({ width: 1760 }).webp({ quality: 82 }).toFile('out.webp');
```

## Resizing and converting

macOS `sips` can't write WebP. Use `sharp`:

```js
await sharp('in.png').resize({ width: 1760 }).webp({ quality: 82 }).toFile('out.webp');
```

## Mockups of several screens

For one image that shows several screens of a product:

- **Three whole screens.** The middle one in front and larger; the side ones behind it, tilted back
  (about 24° on the left and −24° on the right).
- **Crop each screenshot to its screen's proportions**, so it shows whole.
- Don't cut wide screens into narrow slices, don't let cards run off the edge, and don't put labels
  or a background in the image. Name the screens in the caption instead.
- Export a **transparent WebP**; it then works on both themes, shown without a card around it.
- Drive the layout from a small spec file (screens, tilt, sizes) rendered by a headless browser, so
  a mockup can be re-made when a screen changes.
