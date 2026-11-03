# Blueprint for a new project

**Read when:** you start a new Nuxt UI app, add a folder or file and need to know where it goes, or name
something.
**Owns:** the folder tree for `app/`, `server/`, `shared/`; the day-one file list; the layouts and error page;
the house components and composables with their signatures; naming rules.

## TL;DR

- Nuxt 4 layout: `app/` (the page), `server/` (Nitro), `shared/` (types and helpers both use).
- Day one: copy the three files in `assets/`, then write the files in "Day one" below in that order.
- Every screen is built from the house components here plus Nuxt UI; patterns in [components.md](components.md).
- Names say what a thing is: `InvoicesPage`, `InvoiceModal`, `useDeleteInvoice`, `invoices.post.ts`.

## Folder tree

```
app/
  app.vue               UApp, html lang/dir, NuxtLayout          (i18n-rtl.md#two-settings-both-needed)
  app.config.ts         ui colours and component defaults        (assets/app.config.ts)
  error.vue             full-page error, outside every layout
  assets/css/main.css   the theme                                (assets/main.css)
  layouts/
    dashboard.vue       sidebar + header tools + main panel
    auth.vue            centred card for sign-in and first setup
  pages/                one file per URL; a page picks its layout with definePageMeta
  components/           auto-imported, flat, PascalCase (see naming)
  composables/          useX(): state and actions that need Vue context (toast, overlay, route)
  utils/                plain functions and module-level refs: format, labels, locale
  plugins/              i18n.ts (hands the dictionaries to shared/utils/i18n.ts)
server/
  api/                  /api/* handlers, one file per route and method
    invoices.get.ts  invoices.post.ts  invoices/[id].post.ts  invoices/[id].delete.ts
    auth/login.post.ts  auth/logout.post.ts
  routes/               files served at the root: sitemap.xml.ts, robots.txt.ts
  middleware/           runs on every request in name order: 1.guard.ts, 2.auth.ts
  plugins/              Nitro start-up code (restart dev after creating the folder)
  utils/                auto-imported in server code: handler, locale, db, auth, one file per domain
shared/
  types/                types the page and server both read (no runtime values)
  utils/                i18n.ts and pure rules both sides run (validation, formatting of codes)
  locales/              ar.ts, en.ts
public/                 logo.svg, favicon.svg, copied as is
tests/                  bun test or vitest, outside app/ and server/
```

- `app/components`, `app/composables`, `app/utils` and `shared/utils` are auto-imported in the page;
  `server/utils` and `shared/utils` in the server. Server code never sees `app/utils`.
- `shared/` imports runtime data from a relative path only as types; see [gotchas.md](gotchas.md#nitro-and-shared-code).

## Day one

| # | File | Source |
|---|---|---|
| 1 | `package.json`, `.nvmrc`, `nuxt.config.ts` | [setup.md](setup.md#install), [`../assets/nuxt.config.ts`](../assets/nuxt.config.ts) |
| 2 | `app/assets/css/main.css`, `app/app.config.ts` | [`../assets/main.css`](../assets/main.css), [`../assets/app.config.ts`](../assets/app.config.ts) |
| 3 | `shared/utils/i18n.ts`, `shared/locales/{ar,en}.ts`, `app/utils/locale.ts`, `app/plugins/i18n.ts`, `server/utils/locale.ts` | [i18n-rtl.md](i18n-rtl.md#dictionaries-shared-by-page-and-server) |
| 4 | `app/app.vue` | [i18n-rtl.md](i18n-rtl.md#two-settings-both-needed) |
| 5 | `app/layouts/dashboard.vue`, `app/layouts/auth.vue`, `app/error.vue` | below |
| 6 | `server/utils/handler.ts`, `server/middleware/1.guard.ts`, `app/composables/useApi.ts` | [setup.md](setup.md#api-calls) |
| 7 | the house components and composables | below |
| 8 | `public/logo.svg`, `public/favicon.svg` | your own |

## Layouts

### app/layouts/dashboard.vue

The shell: sidebar `w-64` from `lg`, a header with a tool pill, and the page on a rounded panel over the grey
page. Under `lg` a `USelect` replaces the sidebar.

```vue
<script setup lang="ts">
const route = useRoute()
const nav = computed(() => [
  { label: t('nav.overview'), icon: 'i-lucide-layout-dashboard', to: '/' },
  { label: t('nav.invoices'), icon: 'i-lucide-receipt', to: '/invoices' },
  { label: t('nav.settings'), icon: 'i-lucide-settings', to: '/settings' },
])
const isCurrent = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
const current = computed(() => nav.value.find(item => isCurrent(item.to))?.to)
</script>

<template>
  <div class="min-h-screen bg-muted lg:flex">
    <aside class="hidden w-64 shrink-0 flex-col gap-6 px-3 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
      <AppBrand class="px-2" />
      <nav class="space-y-1">
        <NuxtLink
          v-for="item in nav" :key="item.to" :to="item.to"
          class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isCurrent(item.to) ? 'bg-elevated text-highlighted' : 'text-toned hover:bg-elevated/70'"
          :aria-current="isCurrent(item.to) ? 'page' : undefined"
        >
          <UIcon :name="item.icon" class="size-4.5" /> {{ item.label }}
        </NuxtLink>
      </nav>
      <USeparator />
      <!-- a secondary list: customers, projects, ... -->
    </aside>

    <div class="flex min-w-0 flex-1 flex-col gap-3 p-3 lg:ps-0">
      <header class="flex flex-wrap items-center justify-between gap-3 px-1 lg:min-h-10">
        <div class="flex min-w-0 items-center gap-2 lg:hidden">
          <AppBrand compact />
          <USelect
            :model-value="current" :items="nav.map(item => ({ label: item.label, value: item.to }))"
            class="w-52 max-w-full" :aria-label="t('nav.picker')" @update:model-value="to => navigateTo(String(to))"
          />
        </div>
        <span class="hidden lg:block" />
        <HeaderTools />
      </header>

      <main class="flex-1 space-y-6 rounded-2xl border border-default bg-default p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
```

- `min-w-0` on the content column, or tables and long IDs push it wider instead of shrinking.
- A page opts in with `definePageMeta({ layout: 'dashboard' })`, or name the file `default.vue`.
- Nuxt UI's `UDashboardGroup` / `UDashboardSidebar` / `UDashboardPanel` is the alternative when you need a
  resizable or collapsible sidebar: [components.md](components.md#dashboard-shell).

### app/layouts/auth.vue

```vue
<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-4">
    <div class="w-full max-w-md space-y-6 rounded-2xl border border-default bg-default p-6 sm:p-8">
      <div class="flex items-start justify-between gap-3">
        <AppBrand />
        <LanguageButton />
      </div>
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
```

### app/error.vue

Rendered instead of the whole app, so it repeats `UApp` and reads the same theme.

```vue
<script setup lang="ts">
import type { NuxtError } from '#app'
import { ar, en } from '@nuxt/ui/locale'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useHead({ htmlAttrs: { lang: () => locale.value, dir: () => (isRtl.value ? 'rtl' : 'ltr') } })
</script>

<template>
  <UApp :locale="locale === 'ar' ? ar : en">
    <div class="grid min-h-screen place-items-center bg-muted p-6">
      <div class="grid max-w-md place-items-center gap-3 text-center">
        <span class="grid size-14 place-items-center rounded-full bg-elevated text-muted">
          <UIcon :name="notFound ? 'i-lucide-file-question' : 'i-lucide-circle-alert'" class="size-6" />
        </span>
        <p class="font-mono text-sm text-dimmed"><bdi dir="ltr">{{ error.statusCode }}</bdi></p>
        <h1 class="text-xl font-semibold text-highlighted">{{ notFound ? t('errors.notFound') : t('errors.title') }}</h1>
        <p v-if="!notFound && error.message" class="text-sm text-muted">{{ error.message }}</p>
        <UButton :label="t('errors.home')" icon="i-lucide-house" @click="clearError({ redirect: '/' })" />
      </div>
    </div>
  </UApp>
</template>
```

`throw createError({ statusCode: 404 })` in a page reaches it; a client error is non-fatal unless
`fatal: true` (checked 2026-11-03, nuxt.com/docs/4.x/getting-started/error-handling). A boot failure in a
single-screen app can instead show a centred `UAlert color="error" variant="subtle"` from `app.vue`.

## House components

| Component | Props / slots | Use |
|---|---|---|
| `AppBrand` | `compact?: boolean` | logo `size-9 rounded-[10px]` + app name `font-semibold text-highlighted`; compact hides the name |
| `AppFooter` | — | a `rounded-full border bg-default text-xs text-muted` pill: author link, divider, `v{{ version }}` in `font-mono` |
| `HeaderTools` | — | the header pill: refresh, language, colour mode, sign out ([components.md](components.md#header-tools)) |
| `LanguageButton` | — | ghost `size="sm"` button labelled with the language you switch **to** (`EN` / `AR`), `font-mono font-semibold` |
| `FieldLabel` | `label: string`, `hint: string` | a form label with the hint behind an info icon |
| `StatTile` | `title`, `icon`, `hint?`, `loading?`; default slot = value | a number card with its own skeleton |
| `EmptyState` | `icon`, `title`; default slot = buttons | round icon, one line, next actions |
| `ConfirmModal` | `title`, `description?`, `confirmLabel?`, `danger?`; emits `close: [boolean]` | opened only through `useConfirm` |

```vue
<!-- FieldLabel.vue -->
<script setup lang="ts">
defineProps<{ label: string, hint: string }>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    {{ label }}
    <UTooltip :text="hint"><UIcon name="i-lucide-info" class="size-3.5 text-dimmed" :aria-label="hint" /></UTooltip>
  </span>
</template>
```

```vue
<!-- StatTile.vue -->
<script setup lang="ts">
defineProps<{ title: string, icon: string, hint?: string, loading?: boolean }>()
</script>

<template>
  <div class="flex items-start justify-between gap-3 rounded-xl border border-default bg-default p-5">
    <div class="min-w-0 flex-1">
      <p class="flex items-center gap-1.5 text-sm text-toned">
        {{ title }}
        <UTooltip v-if="hint" :text="hint" :content="{ side: 'top' }"><UIcon name="i-lucide-info" class="size-3.5 text-dimmed" /></UTooltip>
      </p>
      <div v-if="loading" class="mt-3 space-y-2"><USkeleton class="h-7 w-28" /><USkeleton class="h-3.5 w-36" /></div>
      <div v-else class="mt-2"><slot /></div>
    </div>
    <div class="grid size-10 shrink-0 place-items-center rounded-lg border border-default bg-muted text-toned">
      <UIcon :name="icon" class="size-5" />
    </div>
  </div>
</template>
```

Value in the slot: `<p class="text-2xl font-semibold text-highlighted tabular-nums">`, then a
`text-xs text-muted` line. Tiles sit in `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`.

```vue
<!-- EmptyState.vue -->
<script setup lang="ts">
defineProps<{ icon: string, title: string }>()
</script>

<template>
  <div class="grid place-items-center gap-3 py-20 text-center">
    <span class="grid size-14 place-items-center rounded-full bg-elevated text-muted"><UIcon :name="icon" class="size-6" /></span>
    <p class="font-semibold text-highlighted">{{ title }}</p>
    <div class="flex flex-wrap justify-center gap-2"><slot /></div>
  </div>
</template>
```

```vue
<!-- ConfirmModal.vue -->
<script setup lang="ts">
defineProps<{ title: string, description?: string, confirmLabel?: string, danger?: boolean }>()
const emit = defineEmits<{ close: [value: boolean] }>()
</script>

<template>
  <UModal :title :description :close="false" :dismissible="false" :ui="{ footer: 'justify-end' }">
    <template #footer>
      <UButton :label="t('common.cancel')" color="neutral" variant="outline" @click="emit('close', false)" />
      <UButton
        :label="confirmLabel ?? t('common.continue')" :icon="danger ? 'i-lucide-trash-2' : undefined"
        :color="danger ? 'error' : 'primary'" @click="emit('close', true)"
      />
    </template>
  </UModal>
</template>
```

## House composables

| Composable | Signature | Does |
|---|---|---|
| `useApi` | `() => <T>(path, { method?, body?, query? }) => Promise<T>` | the only way the page calls `/api`: headers, locale, 401, readable `Error` ([setup.md](setup.md#api-calls)) |
| `useSession` | `() => { info, status, loadApp, signOut }`, `status: 'loading' \| 'setup' \| 'login' \| 'ready'` | who is signed in; `app.vue` or a route middleware picks the screen from `status` |
| `useConfirm` | `() => (props: ConfirmProps) => Promise<boolean>` | opens `ConfirmModal` through `useOverlay` |
| `useCopy` | `() => (text: string) => Promise<void>` | clipboard write plus its own toast |
| `use<Verb><Thing>` | `() => (item) => Promise<boolean>` | confirm → write → toast → reload, e.g. `useDeleteInvoice` |

```ts
// composables/useConfirm.ts
import { ConfirmModal } from '#components'

export function useConfirm() {
  const overlay = useOverlay()
  return (props: { title: string, description?: string, confirmLabel?: string, danger?: boolean }): Promise<boolean> =>
    overlay.create(ConfirmModal, { destroyOnClose: true, props }).open().then(Boolean)
}
```

```ts
// composables/useCopy.ts
export function useCopy() {
  const toast = useToast()
  return async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      toast.add({ title: t('common.copied'), color: 'success', icon: 'i-lucide-check' })
    }
    catch {
      toast.add({ title: t('common.copyFailed'), color: 'error' })
    }
  }
}
```

```ts
// composables/useDeleteInvoice.ts
export function useDeleteInvoice() {
  const api = useApi()
  const confirm = useConfirm()
  const toast = useToast()

  return async (invoice: Invoice): Promise<boolean> => {
    if (!(await confirm({ title: t('invoices.deleteTitle', { number: invoice.number }), confirmLabel: t('invoices.delete'), danger: true }))) {
      return false
    }
    try {
      await api(`/api/invoices/${invoice.id}`, { method: 'DELETE' })
    }
    catch (error) {
      toast.add({ title: t('invoices.deleteFailed'), description: (error as Error).message, color: 'error' })
      return false
    }
    toast.add({ title: t('invoices.deleted'), color: 'success', icon: 'i-lucide-check' })
    return true
  }
}
```

Every write that cannot be undone goes through one of these, so none skips the confirmation.

## Naming

| Thing | Rule | Example |
|---|---|---|
| Component | PascalCase, flat in `components/`, noun first | `InvoicesPage`, `InvoiceForm` |
| A whole screen | `<Thing>Page` | `SettingsPage` |
| A tab's body | `<Thing>Panel` | `ReportsPanel` |
| Overlays | `<Thing>Modal`, `<Thing>Slideover` | `InvoiceModal` |
| Shell pieces | `App<Part>` | `AppBrand`, `AppFooter` |
| Composable | `use<Thing>` for state, `use<Verb><Thing>` for an action | `useSession`, `useDeleteInvoice` |
| Utils file | camelCase noun, plural for a set | `format.ts`, `labels.ts`, `locale.ts` |
| Status helper | `<thing>Of(value) → { label, tone, icon }` | `statusOf` |
| API route | `<resource>.<method>.ts`, `[id]` for one item, verbs as sub-paths | `invoices/[id]/send.post.ts` |
| Middleware | numbered prefix for order | `1.guard.ts` |
| Dictionary key | `area.camelCaseKey` | `invoices.deleteTitle` |
| Storage key | `<app>:<name>` | `my-app:locale` |
| CSS token | `--<area>-<name>` in `main.css` | `--chart-bar` |
| Icon | `i-lucide-<name>` | `i-lucide-receipt` |

Never name a variable `t`: it hides the auto-imported `t()`.
