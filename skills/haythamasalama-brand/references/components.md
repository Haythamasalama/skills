# Component templates

**Read when:** you build the shell or the small parts of a page in his brand: the signature in the header, the
header and footer, the theme toggle, a copy button, filter chips, a page header, badges and cards.
**Owns:** short Vue templates of the site's components, with the classes they ship with.

Taken from the site's components (checked 2026-11-03), trimmed to what makes them look and behave the same. They
are Nuxt 4 single-file components using the Tailwind setup in [code.md](code.md) and `@nuxt/icon` with the `lucide`
and `simple-icons` collections. In plain Vue, swap `NuxtLink` for `RouterLink` or `<a>`.

## TL;DR

- Every interactive element is at least 44 px tall (`min-h-11`, `size-11`) and has a visible focus ring.
- Idle text is `muted`; hover and the current item go to `fg`, with `hover:bg-surface` on icon buttons.
- Colour appears only in badges, the live dot, the copied state and the focus ring.
- Icon-only buttons carry an `aria-label`; state is exposed with `aria-current` or `aria-pressed`.

## Signature mark

Draws the signature from `haythamasalama-signature-strokes.json` (rules in [logo.md](logo.md#drawn-on-screen)).

```vue
<script setup lang="ts">
import signature from '~/assets/haythamasalama-signature-strokes.json'

const { width = 80, animated = true } = defineProps<{ width?: number; animated?: boolean }>()
const height = computed(() => Math.round(width * 79 / 156))
</script>

<template>
  <svg class="signature" :width="width" :height="height" :viewBox="signature.viewBox" fill="none"
       stroke-width="3.2" stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path
      v-for="(stroke, index) in signature.strokes" :key="index" :d="stroke.d"
      :style="animated
        ? { strokeDasharray: stroke.length, strokeDashoffset: stroke.length,
            animationDuration: `${stroke.duration}s`, animationDelay: `${stroke.delay}s` }
        : { animation: 'none' }"
    />
  </svg>
</template>
```

## Header

Signature home link at the start, plain links and a contact pill at the end, and a full-screen menu on phones.

```vue
<script setup lang="ts">
const nav = [
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Blog', to: '/articles' },
]
const contact = { label: 'Contact', to: '/contact' }

const route = useRoute()
const menuOpen = ref(false)
const isCurrent = (to: string) => route.path === to || route.path.startsWith(`${to}/`)

watch(() => route.path, () => { menuOpen.value = false })
watch(menuOpen, open => document.documentElement.classList.toggle('overflow-hidden', open))
</script>

<template>
  <header>
    <div class="relative z-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4 md:pt-7">
      <NuxtLink to="/" class="inline-flex min-h-11 items-center" aria-label="Haytham A. Salama, home">
        <SignatureMark :key="`m${route.path}`" class="md:hidden" :width="72" />
        <SignatureMark :key="`d${route.path}`" class="hidden md:block" :width="80" />
      </NuxtLink>

      <nav aria-label="Primary" class="hidden flex-wrap items-center gap-x-5 text-sm md:flex">
        <NuxtLink
          v-for="item in nav" :key="item.to" :to="item.to"
          class="link-muted inline-flex min-h-11 items-center" :class="isCurrent(item.to) && '!text-fg'"
          :aria-current="isCurrent(item.to) ? 'page' : undefined"
        >{{ item.label }}</NuxtLink>
        <NuxtLink :to="contact.to" class="inline-flex min-h-9 items-center rounded-full border border-chip px-3.5 text-fg transition-colors hover:bg-surface">
          {{ contact.label }}
        </NuxtLink>
      </nav>

      <button
        type="button" class="-mr-2.5 inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-soft transition-colors hover:bg-surface hover:text-fg md:hidden"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen" aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="relative block h-3 w-[18px]" aria-hidden="true">
          <span class="absolute top-0.5 left-0 h-[1.5px] w-full rounded-full bg-current transition-[translate,rotate] duration-300 motion-reduce:transition-none"
                :class="menuOpen && 'translate-y-[3.25px] rotate-45'" />
          <span class="absolute right-0 bottom-0.5 h-[1.5px] rounded-full bg-current transition-[translate,rotate,width] duration-300 motion-reduce:transition-none"
                :class="menuOpen ? 'w-full -translate-y-[3.25px] -rotate-45' : 'w-[11px]'" />
        </span>
      </button>
    </div>

    <Transition enter-active-class="transition-opacity duration-200 motion-reduce:transition-none" enter-from-class="opacity-0"
                leave-active-class="transition-opacity duration-150 motion-reduce:transition-none" leave-to-class="opacity-0">
      <div v-if="menuOpen" class="fixed inset-0 z-40 overflow-y-auto bg-bg md:hidden">
        <nav id="mobile-menu" aria-label="Primary" class="mx-auto flex max-w-[880px] flex-col px-6 pt-20 pb-10 text-base tracking-[-0.01em]">
          <NuxtLink
            v-for="(item, index) in nav" :key="item.to" :to="item.to" :style="{ '--i': index }"
            class="menu-item link-muted flex min-h-11 items-center" :class="isCurrent(item.to) && '!text-fg'"
            :aria-current="isCurrent(item.to) ? 'page' : undefined"
          >{{ item.label }}</NuxtLink>
          <NuxtLink :to="contact.to" :style="{ '--i': nav.length }"
                    class="menu-item mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-chip text-sm text-fg transition-colors hover:bg-surface">
            {{ contact.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
```

- Close the menu on Escape too (a `keydown` listener added in `onMounted`, removed in `onBeforeUnmount`).
- The page shell around it: `<div class="mx-auto max-w-[880px] px-6">` holding the header, `<main id="main">` and
  the footer, plus a "Skip to content" link that is `sr-only` until focused.

## Footer

```vue
<script setup lang="ts">
const links = [{ label: 'Uses', to: '/uses' }, { label: 'Brand', to: '/brand' }]
const socials = [
  { label: 'GitHub', to: 'https://github.com/haythamasalama', icon: 'simple-icons:github', size: 18 },
  { label: 'X', to: 'https://x.com/haythamasalama', icon: 'simple-icons:x', size: 16 },
  { label: 'LinkedIn', to: 'https://www.linkedin.com/in/haythamasalama', icon: 'brand:linkedin', size: 17 },
  { label: 'Medium', to: 'https://medium.com/@haythamasalama', icon: 'simple-icons:medium', size: 18 },
]
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-7 pb-10">
    <div class="flex flex-wrap items-center gap-x-5 text-[13px] text-faint">
      <p class="w-full sm:w-auto">© {{ year }} Haytham A. Salama</p>
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="link-muted inline-flex min-h-11 items-center">
        {{ link.label }}
      </NuxtLink>
    </div>
    <div class="-mr-3 flex items-center">
      <NuxtLink
        v-for="social in socials" :key="social.label" :to="social.to" :aria-label="social.label" external
        class="inline-flex size-11 items-center justify-center rounded-lg text-mark transition-colors hover:bg-surface hover:text-fg"
      >
        <Icon :name="social.icon" :style="{ width: `${social.size}px`, height: `${social.size}px` }" />
      </NuxtLink>
      <span class="mx-1.5 h-5 w-px bg-line" aria-hidden="true" />
      <ThemeToggle />
    </div>
  </footer>
</template>
```

- Icon sizes differ (16–18 px) so the marks look the same size optically.
- Simple Icons has no LinkedIn mark, so the site keeps its own SVG in a custom `@nuxt/icon` collection (`brand`).
- The site's copyright starts at the year the site began: `© <first year>–<this year>`.

## Theme toggle

```vue
<script setup lang="ts">
const colorMode = useColorMode()
const mounted = ref(false)
onMounted(() => { mounted.value = true })

const isDark = computed(() => !mounted.value || colorMode.value !== 'light')
const label = computed(() => isDark.value ? 'Switch to light theme' : 'Switch to dark theme')
</script>

<template>
  <button type="button" :aria-label="label" :title="label" @click="colorMode.preference = isDark ? 'light' : 'dark'"
          class="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg">
    <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" class="size-[18px]" />
  </button>
</template>
```

It renders the dark label until mounted. **Why:** the server can't know a saved choice, and a different first
render would be a hydration mismatch.

## Copy button

```vue
<script setup lang="ts">
const { text, label = 'Copy' } = defineProps<{ text: string; label?: string }>()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1600)
  }
  catch {}
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <button type="button" :aria-label="copied ? `Copied ${label}` : `Copy ${label}`" @click="copy"
          class="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-surface hover:text-fg">
    <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-3.5" :class="{ 'text-accent-2': copied }" />
    <span :class="{ 'text-gradient': copied }">{{ copied ? 'Copied' : 'Copy' }}</span>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </button>
</template>
```

It fails quietly when the browser blocks the clipboard (an insecure context). Beside a block of text (the bios on
the brand page) it gets a border and a 44 px hit area:
`class="relative min-h-9 border border-edge px-3 before:absolute before:inset-x-0 before:-inset-y-1 hover:border-chip"`.

## Filter chips

```vue
<script setup lang="ts">
defineProps<{ options: { label: string; count: number; badge?: string }[]; label: string }>()
const selected = defineModel<string>({ required: true })
</script>

<template>
  <div role="group" :aria-label="label" class="flex flex-wrap gap-2">
    <button
      v-for="option in options" :key="option.label" type="button" :aria-pressed="selected === option.label"
      class="inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 text-[13px] transition-colors"
      :class="selected === option.label ? 'border border-fg bg-surface text-fg' : 'border border-chip text-muted hover:text-fg'"
      @click="selected = option.label"
    >
      {{ option.label }}
      <span class="ml-1.5 font-mono text-[11.5px] opacity-65">{{ option.count }}</span>
      <span v-if="option.badge" class="ml-2 rounded-[5px] border-gradient px-1.5 font-mono text-[9.5px] leading-4 tracking-[0.1em] uppercase">
        <span class="text-gradient">{{ option.badge }}</span>
      </span>
    </button>
  </div>
</template>
```

A grid or list switch beside the chips uses the same pill: `rounded-full border border-chip p-0.5` around two
`size-8` round buttons, the pressed one `bg-surface text-fg`.

## Page header and section title

```vue
<!-- PageHeader.vue -->
<script setup lang="ts">defineProps<{ title: string }>()</script>

<template>
  <section class="pt-16 md:pt-[88px]">
    <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">{{ title }}</h1>
    <div class="mt-4 space-y-2.5 text-[17px] leading-[1.7] text-soft"><slot /></div>
  </section>
</template>
```

A section inside a page opens with an eyebrow, not a big heading: `<h2 id="work" class="eyebrow mb-3">Selected work</h2>`.
With an `id`, the site wraps the text in a link to `#id` that shows a `faint` "#" on hover.

## Small parts

```html
<!-- badge -->
<span class="rounded-md border-gradient px-[7px] py-0.5 font-mono text-[10.5px] tracking-[0.1em]"><span class="text-gradient">NEW</span></span>

<!-- live status line -->
<p class="flex w-fit items-center gap-2.5 rounded-full border border-line py-2 pr-3.5 pl-3 text-sm text-muted">
  <span class="size-2 shrink-0 animate-live rounded-full bg-linear-135 from-iris-500 to-azure-500" aria-hidden="true"></span>
  <span><span class="text-fg">Now</span> · writing about shipping software</span>
</p>

<!-- numbered card -->
<li class="flex flex-col gap-2.5 rounded-2xl border border-line p-[22px]">
  <span class="font-mono text-xs text-iris-400 light:text-iris-600">01</span>
  <h3 class="text-[17px] font-semibold tracking-[-0.01em]">Ink first</h3>
  <p class="text-sm leading-[1.6] text-muted">Black, white and generous space carry everything.</p>
</li>

<!-- link with a nudging arrow -->
<a href="/about" class="go link-muted inline-flex min-h-11 items-center text-sm">More about me<span class="arrow" aria-hidden="true">→</span></a>

<!-- tech chip -->
<span class="inline-flex items-center gap-1.5 rounded-full border border-line py-1 pr-2.5 pl-2 text-[13px] leading-[18px] text-soft">Laravel</span>
```

- The arrow is `↗` for a link that leaves the site.
- A tech chip for the everyday stack is brighter: `border-chip text-fg`. Its icon, if any, is `text-mark`.
