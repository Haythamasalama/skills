# Static sites, GitHub Pages and SEO

Prerendering a Nuxt UI site to plain files, hosting it on GitHub Pages, the head tags, structured data and
crawler files that go with it, and the landing page sections that worked. Checked 2026-10-27 (Nuxt 4.6, Nitro 2).

## Prerender

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/', '/ar/', '/sitemap.xml', '/robots.txt', '/llms.txt'],
      crawlLinks: true,   // follow links from those pages; a broken internal link then fails the build
    },
  },
})
```

- `nuxt generate` writes the site to `.output/public` (or `<app>/.output/public` for `nuxt generate <app>`).
- Server routes such as `server/routes/sitemap.xml.ts` run once at build time **only if listed** in `routes`.
- Pages that fetch data at build time need unique `useAsyncData` keys; Nuxt 4 shares state between calls with the
  same key.
- A util that is auto-imported in dev can be missing during prerender. If a build fails with "x is not defined",
  import it explicitly: `import { installCommand } from '~/utils/content'`.
- Server routes cannot see `app/utils`. Import shared data with a relative path:
  `import { content } from '../../app/utils/content'`, or move it to `shared/`.

## Icons on a static host

No server means no icon API at runtime. Bundle every icon the pages use:

```ts
icon: {
  provider: 'none',
  clientBundle: { scan: { globInclude: ['**/*.{vue,ts}'] } },
}
```

The default scan only reads `.vue` files. Icon names kept in a `.ts` content file (feature lists, nav items) are
then missing and render as empty boxes. If an icon name is built at runtime (string concatenation), the scan cannot
see it; list it in `clientBundle.icons: ['lucide:...']`.

## GitHub Pages

```yaml
# .github/workflows/site.yml
name: Website

on:
  push:
    branches: [main]
    paths: [site/**, public/**, app/assets/css/main.css, package.json, .github/workflows/site.yml]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run site:generate
        env:
          NUXT_APP_BASE_URL: /<repository-name>/   # drop this with a custom domain
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/.output/public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- In the repository settings, set Pages to "GitHub Actions" as the source.
- Project pages live under `https://<user>.github.io/<repository-name>/`, so the build needs that base URL.
  A custom domain serves the site from `/`; then leave `NUXT_APP_BASE_URL` out and set the domain in the
  repository's Pages settings.
- The Actions flow serves the artifact as is. Pushing to a `gh-pages` branch instead needs an empty `.nojekyll` file,
  or folders starting with `_` (like `_nuxt/`) are not served.

### Paths under a base URL

`NuxtLink`, `useRouter` and built assets get the base URL. Raw paths to `public/` files in templates do not:
`<img src="/logo.svg">` works locally and 404s under `/<repository-name>/`.

```ts
// app/composables/useLang.ts or app/utils/asset.ts
export const asset = (path: string) => `${useRuntimeConfig().app.baseURL}${path}`
```

```vue
<img :src="asset('logo.svg')" width="32" height="32" alt="">
<link rel="icon" :href="asset('favicon.svg')">
```

Absolute URLs for SEO (canonical, Open Graph images, sitemap) come from a `siteUrl` in `runtimeConfig.public`, not
from the base URL.

### Check a sub-folder build locally

```bash
NUXT_APP_BASE_URL=/demo/ bun run site:generate
rm -rf .pages-check && mkdir .pages-check && cp -R site/.output/public .pages-check/demo
npx serve .pages-check   # open http://localhost:3000/demo/, then delete .pages-check
```

## Head tags per page

```ts
// app/composables/useSiteSeo.ts
export function useSiteSeo() {
  const { text, lang, isRtl } = useLang()
  const { siteUrl } = useRuntimeConfig().public
  const pageUrl = computed(() => `${siteUrl}${lang.value === 'ar' ? '/ar/' : '/'}`)
  const image = computed(() => `${siteUrl}/screenshots/${lang.value === 'ar' ? 'arabic.png' : 'overview.png'}`)

  useHead({
    htmlAttrs: { lang, dir: () => (isRtl.value ? 'rtl' : 'ltr') },
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: asset('favicon.svg') },
      { rel: 'canonical', href: pageUrl },
      { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/` },
      { rel: 'alternate', hreflang: 'ar', href: `${siteUrl}/ar/` },
      { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` },
      { rel: 'alternate', type: 'text/markdown', title: 'llms.txt', href: `${siteUrl}/llms.txt` },
      { rel: 'sitemap', type: 'application/xml', href: `${siteUrl}/sitemap.xml` },
    ],
    // structuredData: see "Structured data" below
    script: [{ type: 'application/ld+json', innerHTML: () => JSON.stringify(structuredData.value) }],
  })

  useSeoMeta({
    title: () => text.value.title,
    description: () => text.value.description,
    robots: 'index, follow',
    ogType: 'website',
    ogSiteName: text.value.brand,
    ogTitle: () => text.value.title,
    ogDescription: () => text.value.description,
    ogUrl: pageUrl,
    ogLocale: () => (lang.value === 'ar' ? 'ar_AR' : 'en_US'),
    ogLocaleAlternate: () => [lang.value === 'ar' ? 'en_US' : 'ar_AR'],
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => text.value.hero.image,
    twitterCard: 'summary_large_image',
    twitterTitle: () => text.value.title,
    twitterDescription: () => text.value.description,
    twitterImage: image,
  })
}
```

- Title: what it is, then the name, 50 to 60 characters. Description: 150 to 220 characters, plain words.
- The canonical URL of each language points at itself, not at the English page.
- `og:image` is an absolute URL with real width and height. 1200×630 is the safe size.
- `theme-color` in `app.head.meta`, matching the primary 600 shade.

## Structured data (JSON-LD)

One `@graph` per page. For a software product:

```ts
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      'name': 'Product name',
      'description': text.value.description,
      'url': pageUrl.value,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Linux, macOS, Windows (Docker)',
      'softwareVersion': version,
      'license': 'https://opensource.org/licenses/MIT',
      'isAccessibleForFree': true,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'screenshot': screenshots.map(file => `${siteUrl}/screenshots/${file}`),
      'inLanguage': ['en', 'ar'],
      'author': { '@type': 'Person', 'name': 'Author name', 'url': 'https://example.com' },
    },
    {
      '@type': 'FAQPage',
      'inLanguage': lang.value,
      'mainEntity': text.value.faq.items.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': { '@type': 'Answer', 'text': item.answer },
      })),
    },
  ],
}))
```

- The FAQ JSON-LD uses the same items as the visible FAQ section. Never mark up text the page does not show.
- Add `SoftwareSourceCode` with `codeRepository` for open-source projects, linked through `targetProduct`.
- Check the output with the Rich Results Test and the Schema.org validator.

## sitemap.xml, robots.txt and llms.txt

```ts
// server/routes/sitemap.xml.ts
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig().public
  const pages = [`${siteUrl}/`, `${siteUrl}/ar/`]
  const today = new Date().toISOString().slice(0, 10)
  const alternates = [['en', pages[0]], ['ar', pages[1]], ['x-default', pages[0]]]
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...pages.map(loc => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`),
    '</urlset>',
    '',
  ].join('\n')
})
```

```ts
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig().public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
```

`llms.txt` (the llmstxt.org convention) is the page as plain Markdown for AI assistants: an `# H1` name, a
`> summary` line, then sections for features, install, privacy, questions and links. Build it from the same content
object the page uses, with `content-type: text/markdown; charset=utf-8`.

On a host that runs Nitro, `@nuxtjs/sitemap` and `@nuxtjs/robots` do this from the routes. Hand-written routes are
simpler for a one or two page static site.

## Landing page sections

- Sticky header: `sticky top-0 z-40 border-b border-default bg-muted/80 backdrop-blur`, inner
  `mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6`. Nav links as ghost neutral
  buttons, hidden below `md`.
- Hero: a subtle primary badge (`rounded-full`), `h1` `text-4xl sm:text-5xl font-semibold tracking-tight
  text-balance`, one paragraph `text-lg/8 text-pretty text-muted`, two `size="xl"` buttons, and a screenshot in a
  `rounded-2xl border border-default bg-default p-1.5 sm:p-2` frame.
- Feature grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`, each item an icon tile, a title and one sentence.
- Steps: an `<ol>` with numbered `size-8 rounded-full bg-primary text-inverted` circles.
- Command box: `<pre dir="ltr">` in `font-mono text-[13px] break-all whitespace-pre-wrap` with a copy button.
- FAQ: a `<dl>` in two columns from `md`. The same items feed the FAQ JSON-LD.
- Footer: logo, version (`<bdi dir="ltr">v1.2.3</bdi>`), licence, author, separated by `aria-hidden` middle dots.

## Content as data

Keep every visible string of a landing page in one typed object per language (`app/utils/content.ts`), used by the
page, the SEO composable and `llms.txt`. One edit then updates the page, the meta tags and the crawler files.

## Images and performance

- Every `<img>` has `width` and `height` (no layout shift) and an `alt` that says what it shows.
- The hero image: `fetchpriority="high"`. Images below the fold: `loading="lazy"`.
- Light and dark screenshots: two `<img>` with `dark:hidden` / `hidden dark:block`; only the first gets
  `fetchpriority="high"`.
- Screenshots use demo data only.
- Sticky header plus anchors: `html { scroll-behavior: smooth; scroll-padding-top: 5rem }`. Turn smooth scrolling
  off under `prefers-reduced-motion`.

## Checklist

- [ ] `nuxt generate` passes with `crawlLinks` on.
- [ ] `view-source` of each generated page shows the title, description, canonical, `hreflang` and the JSON-LD.
- [ ] `/sitemap.xml`, `/robots.txt` and `/llms.txt` exist in `.output/public`.
- [ ] Icons render on the generated build, not only in dev.
- [ ] A sub-folder build loads its logo, favicon and screenshots.
