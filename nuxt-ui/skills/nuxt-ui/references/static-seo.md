# Static sites, GitHub Pages and SEO

**Read when:** you prerender a Nuxt UI site, host it on GitHub Pages, or write its head tags, structured data,
sitemap, robots.txt or llms.txt.
**Owns:** `nuxt generate` and prerender routes, icons without a server, GitHub Pages and the base URL, head tags
per page and per language, JSON-LD, crawler files, content as one typed object, image loading.

## TL;DR

- `nitro.prerender.routes` lists every page **and** every server route file; `crawlLinks` finds the rest.
- No server, no icon API: `icon.provider: 'none'` with a client bundle that scans `.vue` and `.ts`.
- Under a sub-folder, build with `NUXT_APP_BASE_URL=/<repo>/` and prefix raw `public/` paths with `asset()`.
- Each page: title, description, canonical to itself, `hreflang` en / ar / x-default, Open Graph, one JSON-LD
  `@graph`.
- One typed content object per language feeds the page, the meta tags and `llms.txt`.

## Prerender

```ts
// site/nuxt.config.ts
nitro: {
  prerender: {
    routes: ['/', '/ar/', '/docs/getting-started/', '/ar/docs/getting-started/', '/sitemap.xml', '/robots.txt', '/llms.txt'],
    crawlLinks: true,   // a broken internal link then fails the build
  },
},
```

- `nuxt generate` writes `.output/public` (`site/.output/public` for `nuxt generate site`).
- `server/routes/*.ts` run once at build time only when listed.
- Data fetched at build time needs unique `useAsyncData` keys; Nuxt 4 shares state between calls with one key.
- Server routes do not see `app/utils`: import content with a relative path
  (`import { content } from '../../app/utils/content'`) or move it to `shared/`.

## Icons without a server

```ts
icon: {
  provider: 'none',
  clientBundle: { scan: { globInclude: ['**/*.{vue,ts}'] } },
},
```

`globInclude` replaces the default list, so keep every extension you need (checked 2026-11-03,
ui.nuxt.com/docs/getting-started/integrations/icons/nuxt). Names built at runtime
(`` `i-lucide-${name}` ``) are invisible to the scan; write them in full or list them in `clientBundle.icons`.

## GitHub Pages

```yaml
# .github/workflows/site.yml
name: Website
on:
  push:
    branches: [main]
    paths: [site/**, docs/screenshots/**, public/**, app/assets/css/main.css, package.json, .github/workflows/site.yml]
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version-file: .nvmrc }
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run site:generate
        env:
          NUXT_APP_BASE_URL: /<repository>/   # leave out with a custom domain
      - uses: actions/upload-pages-artifact@v5
        with: { path: site/.output/public }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- Action versions as listed on nuxt.com/deploy/github-pages (checked 2026-11-03). That page builds with
  `nuxt build --preset github_pages`; `nuxt generate` gives the same static output for a fully prerendered site.
- Repository settings → Pages → source "GitHub Actions".
- A project site lives at `https://<owner>.github.io/<repository>/` and needs the base URL. A user site or a
  custom domain serves from `/`: leave `NUXT_APP_BASE_URL` out and set the domain in the Pages settings (it
  writes `CNAME`).
- Pushing to a `gh-pages` branch instead needs an empty `.nojekyll`, or `_nuxt/` is not served.

### Paths under a base URL

`NuxtLink` and built assets get the base URL; raw paths to `public/` files do not.

```ts
// app/composables/useLang.ts (or app/utils/asset.ts)
export const asset = (path: string) => `${useRuntimeConfig().app.baseURL}${path}`
```

`<img :src="asset('logo.svg')" width="32" height="32" alt="">`. Absolute SEO URLs (canonical, `og:image`,
sitemap) come from `runtimeConfig.public.siteUrl`, never from the base URL.

Check a sub-folder build locally:

```bash
NUXT_APP_BASE_URL=/demo/ bun run site:generate
mkdir -p .pages-check && cp -R site/.output/public .pages-check/demo && npx serve .pages-check
# open /demo/, then delete .pages-check
```

## Head tags

```ts
// app/composables/useSiteSeo.ts
export function useSiteSeo() {
  const { text, lang, isRtl } = useLang()
  const { siteUrl } = useRuntimeConfig().public
  const pageUrl = computed(() => `${siteUrl}${lang.value === 'ar' ? '/ar/' : '/'}`)
  const image = computed(() => `${siteUrl}/screenshots/${lang.value === 'ar' ? 'overview-ar.png' : 'overview.png'}`)

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
    script: [{ type: 'application/ld+json', innerHTML: () => JSON.stringify(structuredData.value) }],
  })

  useSeoMeta({
    title: () => text.value.title,
    description: () => text.value.description,
    robots: 'index, follow',
    ogType: 'website',
    ogSiteName: () => text.value.brand,
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
    twitterImage: image,
  })
}
```

- Title: what it is, then the name, 50–60 characters. Description: 150–220 characters, plain words.
- Each language's canonical points at itself, not at the English page.
- `og:image` is absolute, with its real width and height.
- A docs page uses the same calls with its own path, `ogType: 'article'` and alternates to its twin page.

## Structured data

One `@graph` per page. For a software product page:

```ts
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      'name': content.en.brand,
      'alternateName': content.ar.brand,
      'description': text.value.description,
      'url': pageUrl.value,
      'applicationCategory': 'BusinessApplication',
      'softwareVersion': version,
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
      'screenshot': SCREENSHOTS.map(file => `${siteUrl}/screenshots/${file}`),
      'featureList': text.value.features.items.map(item => `${item.title}: ${item.text}`),
      'inLanguage': ['en', 'ar'],
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

- The FAQ graph uses the same items as the visible FAQ. Never mark up text the page does not show.
- Open source: add `SoftwareSourceCode` with `codeRepository` and `targetProduct: { '@id': … }`.
- Docs pages: `TechArticle` (`headline`, `inLanguage`, `about: { '@id': '<site>/#app' }`, `articleSection`) plus a
  `BreadcrumbList`.
- Check with the Rich Results Test and the Schema.org validator.

## sitemap.xml, robots.txt, llms.txt

```ts
// server/routes/sitemap.xml.ts
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig().public
  const today = new Date().toISOString().slice(0, 10)
  const pairs = [['/', '/ar/'], ['/docs/getting-started/', '/ar/docs/getting-started/']]
  const urls = pairs.flatMap(([en, ar]) => {
    const alternates = [['en', en], ['ar', ar], ['x-default', en]]
      .map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${siteUrl}${path}"/>`).join('\n')
    return [en, ar].map(path => `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`)
  })

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls, '</urlset>', ''].join('\n')
})
```

```ts
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${useRuntimeConfig().public.siteUrl}/sitemap.xml\n`
})
```

`llms.txt` (llmstxt.org) is the site as Markdown for AI assistants: `# Name`, a `> summary` line, then
Features, Install, Questions, guide sections and Links, built from the same content object, served as
`text/markdown; charset=utf-8`. On a Nitro host, `@nuxtjs/sitemap` and `@nuxtjs/robots` can do this; hand-written
routes are simpler for a few static pages.

## Content as data

Every visible string of the site lives in one typed object per language (`app/utils/content.ts`, guides in
`app/utils/docs.ts`), each guide with its own `path`, `title`, `description`, `sections[]` and image list.
One edit updates the page, the meta tags, the sitemap and `llms.txt`.

## Images

- Every `<img>` has `width`, `height` and an `alt` that says what it shows.
- Hero: `fetchpriority="high"`; below the fold: `loading="lazy"`.
- Light and dark screenshots: two `<img>` with `dark:hidden` / `hidden dark:block`; only the light one gets
  `fetchpriority="high"`. A language may have its own screenshot.
- Screenshots use demo data only.
