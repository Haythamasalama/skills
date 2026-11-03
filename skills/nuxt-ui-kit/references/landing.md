# Landing and docs pages

**Read when:** you build a marketing page or a docs page with Nuxt UI: header, hero, features, screenshots,
install, FAQ, footer, guide layout.
**Owns:** section order, markup and spacing of a product landing page and a docs page.

## TL;DR

- Page: `min-h-screen bg-muted text-default`; sections alternate `bg-muted` and `bg-default` with
  `border-y border-default`.
- Section box: `mx-auto max-w-6xl px-4 sm:px-6 py-20`; narrow text sections `max-w-2xl` or `max-w-3xl`.
- Section heading: `text-3xl font-semibold tracking-tight text-balance text-highlighted`, intro
  `text-pretty text-muted`.
- Screenshots sit in a frame: `rounded-2xl border border-default bg-default p-1.5 sm:p-2`, image `rounded-xl`.
- Each section has an `id` the header links to; `scroll-padding-top: 5rem` keeps it under the sticky header.

## Section order

1. Sticky header 2. Hero 3. Features (`#features`) 4. Screenshots (`#screenshots`) 5. Install or pricing
(`#install`) 6. A trust section (privacy, security) 7. FAQ (`#faq`) 8. Footer.

## Header

```vue
<header class="sticky top-0 z-40 border-b border-default bg-muted/80 backdrop-blur">
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
    <a :href="home" class="flex min-w-0 items-center gap-2.5 font-semibold text-highlighted">
      <img :src="asset('logo.svg')" width="32" height="32" alt="" class="size-8 shrink-0">
      <span class="truncate">{{ text.brand }}</span>
    </a>
    <nav class="hidden items-center gap-0.5 rounded-full border border-default bg-default/70 p-1 md:flex">
      <UButton v-for="link in links" :key="link.href" :label="link.label" :to="link.href" size="sm"
               color="neutral" variant="ghost" :active="route.path === link.href" active-variant="soft"
               class="rounded-full px-3 text-toned hover:text-highlighted" />
    </nav>
    <div class="flex shrink-0 items-center gap-0.5">
      <UButton icon="i-lucide-languages" :to="otherPath" :hreflang="lang === 'ar' ? 'en' : 'ar'" :aria-label="text.language" color="neutral" variant="ghost">
        <span class="hidden sm:inline" :lang="lang === 'ar' ? 'en' : 'ar'">{{ lang === 'ar' ? 'English' : 'العربية' }}</span>
      </UButton>
      <UColorModeButton />
      <UDropdownMenu :items="[links.map(l => ({ label: l.label, to: l.href }))]" :content="{ align: 'end' }" class="md:hidden">
        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" :aria-label="text.menu" />
      </UDropdownMenu>
    </div>
  </div>
</header>
```

- Section links point at the home page (`/#features`, `/ar/#features`) so they work from docs pages too.
- The language link names the other language in that language, with its `lang` attribute.

## Hero

```vue
<section class="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
  <UBadge :label="`v${version} · ${text.hero.badge}`" color="primary" variant="subtle" size="lg" class="rounded-full" />
  <h1 class="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-highlighted sm:text-5xl">{{ text.hero.title }}</h1>
  <p class="mx-auto mt-5 max-w-2xl text-lg/8 text-pretty text-muted">{{ text.hero.text }}</p>
  <div class="mt-8 flex flex-wrap justify-center gap-3">
    <UButton :label="text.hero.primary" href="#install" icon="i-lucide-download" size="xl" />
    <UButton :label="text.hero.docs" :to="docsPath" icon="i-lucide-book-open" size="xl" color="neutral" variant="outline" class="bg-default" />
  </div>
  <ul class="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-toned">
    <li v-for="note in text.hero.notes" :key="note" class="inline-flex items-center gap-1.5">
      <UIcon name="i-lucide-circle-check" class="size-4 text-primary" /> {{ note }}
    </li>
  </ul>
  <div class="mt-14 rounded-2xl border border-default bg-default p-1.5 sm:p-2"><!-- light and dark img --></div>
</section>
```

`tracking-tight` is fine on the English heading only; drop it on Arabic (letter spacing breaks joined letters).

## Features

`<section id="features" class="border-y border-default bg-default">`, a centred `max-w-2xl` heading block, then
`<ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">`. Each item:
`rounded-xl border border-default bg-muted/50 p-5`, an icon tile
`grid size-10 place-items-center rounded-lg border border-default bg-default text-primary`,
`h3` `mt-4 font-semibold text-highlighted`, text `mt-1.5 text-sm/6 text-muted`. Icon names live in the content
object, which is why the icon scan must include `.ts`.

## Screenshots

A centred heading, then a `UTabs :content="false"` in an `overflow-x-auto` wrapper with `mx-auto w-max`, then one
framed image with `:key` on the file and `loading="lazy"`. When the language changes, reset the tab to the first
screenshot of that language.

## Install

`max-w-2xl` centred, a `UTabs` choosing the target (computer, server) and a command box:

```vue
<div class="flex items-start gap-2 rounded-lg border border-default bg-muted py-1.5 ps-4 pe-1.5">
  <pre dir="ltr" class="min-w-0 flex-1 py-1.5 text-start font-mono text-[13px] leading-6 break-all whitespace-pre-wrap text-highlighted"><code>{{ command }}</code></pre>
  <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" :color="copied ? 'success' : 'neutral'" variant="ghost"
           :aria-label="copied ? text.copied : text.copy" @click="copy" />
</div>
```

The copy button swaps to a check for two seconds instead of a toast.

## FAQ

Native `<details>` keeps every answer in the HTML, for search engines and AI answers:

```vue
<div class="mt-10 divide-y divide-default overflow-hidden rounded-2xl border border-default bg-muted/40">
  <details v-for="(item, index) in text.faq.items" :key="item.question" class="group" :open="index === 0">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-highlighted transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
      {{ item.question }}
      <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
    </summary>
    <p class="px-5 pb-5 text-sm/7 text-muted">{{ item.answer }}</p>
  </details>
</div>
```

The same items feed the FAQ JSON-LD.

## Footer

`border-t border-default bg-default`, inner `mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row
sm:items-center sm:justify-between sm:px-6`: logo `size-9` and name on the start; on the end `ULink raw` links
(`text-sm text-muted hover:text-highlighted`) and the version as a pill
`rounded-full border border-default px-2.5 py-0.5 font-mono text-xs` with `<bdi dir="ltr">v1.2.3</bdi>`.

## Docs page

- `<main class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[14rem_1fr]">`.
- Aside (from `lg`): `sticky top-24 space-y-1 text-sm`, the guide list then "On this page" anchors; links
  `block rounded-md px-2 py-1 text-muted hover:bg-elevated hover:text-highlighted`, the current one
  `bg-elevated font-medium text-highlighted` with `aria-current="page"`.
- Article `min-w-0 space-y-12`: a back link with `i-lucide-arrow-left rtl:rotate-180`, `h1` `text-4xl
  font-semibold tracking-tight`, intro `max-w-3xl text-lg/8 text-muted`.
- Each section `scroll-mt-24 space-y-4`, `h2` `text-2xl font-semibold`, text `max-w-3xl text-pretty text-toned`,
  points with `i-lucide-circle-check text-primary`, and a framed screenshot.
- A reference table at the end: `<dl>` rows `grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]` in a
  `divide-y rounded-xl border bg-default` box.

## Motion

Smooth anchor scrolling is set in the site's `main.css` ([setup.md](setup.md#two-apps-on-one-theme)), only
without `prefers-reduced-motion`. Hover transitions use
`transition-colors` or `transition-opacity`; no entrance animations.
