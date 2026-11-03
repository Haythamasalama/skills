# Components and screens

**Read when:** you build a screen: the shell, a page header, cards, a table, a form, a modal or slideover, tabs,
an empty state, a toast, a loading state, a chart.
**Owns:** how Nuxt UI components are used and sized in a dashboard, the header tools, tables, forms, overlays,
feedback, charts, and accessibility rules.

## TL;DR

- One `h1` per screen, `h2` per section; one solid primary button per area, on the end; the rest neutral.
- Section card: `rounded-xl border border-default bg-default p-5`; a table card drops the padding.
- Columns are a `computed<TableColumn<T>[]>` so headers follow the language.
- Hints sit behind an info icon in the label (`FieldLabel`), never as a line of help text.
- `USkeleton` shaped like the content while loading; a toast after an action; `useConfirm` before anything
  that cannot be undone.

House components (`StatTile`, `FieldLabel`, `EmptyState`, `ConfirmModal`) and composables are defined in
[blueprint.md](blueprint.md); this file shows how screens use them.

## Dashboard shell

The hand-built shell is `app/layouts/dashboard.vue` in [blueprint.md](blueprint.md#applayoutsdashboardvue).
It suits a tool with a handful of screens.

Nuxt UI's dashboard components give a resizable, collapsible sidebar and a mobile slideover:

```vue
<!-- layouts/dashboard.vue -->
<template>
  <UDashboardGroup storage="local" storage-key="my-app-dashboard">
    <UDashboardSidebar collapsible resizable :default-size="15" :min-size="10" :max-size="20">
      <template #header="{ collapsed }"><AppBrand :compact="collapsed" /></template>
      <template #default="{ collapsed }">
        <UNavigationMenu :items="links" :collapsed="collapsed" orientation="vertical" />
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>

<!-- pages/invoices.vue -->
<template>
  <UDashboardPanel id="invoices">
    <template #header>
      <UDashboardNavbar :title="t('nav.invoices')">
        <template #leading><UDashboardSidebarCollapse /></template>
      </UDashboardNavbar>
    </template>
    <template #body><!-- content --></template>
  </UDashboardPanel>
</template>
```

Checked 2026-11-03 (ui.nuxt.com/docs/components/dashboard-sidebar, dashboard-group, dashboard-panel): sizes are
percent by default (`unit` on the group changes it), the sidebar `mode` on mobile is `slideover` by default
(`drawer`, `modal`), `side` is `left` or `right`, and each panel should get an `id` when several pages use one.
Check the sidebar's side in Arabic before shipping; the docs do not describe RTL.

### Header tools

```vue
<!-- HeaderTools.vue -->
<template>
  <div class="flex items-center gap-1 rounded-lg border border-default bg-default p-1">
    <UTooltip :text="loadedAt ? t('header.refreshedAt', { time: timeOfDay(loadedAt) }) : t('header.refresh')">
      <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="sm" :aria-label="t('header.refresh')" :loading="refreshing" @click="refresh()" />
    </UTooltip>
    <UTooltip :text="t('header.language')">
      <UButton :label="locale === 'ar' ? 'EN' : 'AR'" color="neutral" variant="ghost" size="sm" class="font-mono font-semibold" :aria-label="t('header.language')" @click="setLocale(locale === 'ar' ? 'en' : 'ar')" />
    </UTooltip>
    <UTooltip :text="t('header.signOut')">
      <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" size="sm" :aria-label="t('header.signOut')" @click="signOut()" />
    </UTooltip>
    <UTooltip :text="t('header.colorMode')"><UColorModeButton size="sm" /></UTooltip>
  </div>
</template>
```

## Page header

```vue
<div class="flex flex-wrap items-start justify-between gap-3">
  <div class="min-w-0">
    <h1 class="text-2xl font-bold text-highlighted">{{ t('nav.invoices') }}</h1>
    <p class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <span class="inline-flex items-center gap-1.5">
        <UIcon name="i-lucide-hash" class="size-3.5 text-dimmed" /> <bdi dir="ltr" class="font-mono text-xs">{{ customer.id }}</bdi>
      </span>
    </p>
  </div>
  <div class="flex flex-wrap gap-2">
    <UButton :label="t('invoices.import')" icon="i-lucide-upload" color="neutral" variant="outline" />
    <UButton :label="t('invoices.add')" icon="i-lucide-plus" />
  </div>
</div>
```

A help link is `color="neutral" variant="ghost"` with `i-lucide-circle-help`.

## Cards

- Section: `<section class="space-y-4 rounded-xl border border-default bg-default p-5">` +
  `<h2 class="font-semibold text-highlighted">`. Grid of sections: `grid gap-4 lg:grid-cols-2`.
- Key-value list: `<dl class="divide-y divide-default rounded-lg border border-default text-sm">`, rows
  `flex items-center justify-between gap-3 px-4 py-2.5`, `dt` `text-muted`, `dd` `text-highlighted`.
- A card that opens something is itself a `button` or link, with `hover:shadow-md` and a visible focus ring.
- A share or progress bar: track `h-2 overflow-hidden rounded-full bg-(--chart-track)`, fill
  `h-full rounded-full bg-(--chart-bar)` with `:style="{ width: pct + '%' }"`.

## Tables

```ts
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const columns = computed<TableColumn<Invoice>[]>(() => [
  { id: 'customer', header: t('invoices.customer'), meta: { class: { td: 'w-full min-w-56' } } },
  { id: 'number', header: t('invoices.number'), meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'total', header: t('invoices.total'), meta: { class: { th: 'hidden lg:table-cell', td: 'hidden lg:table-cell' } } },
  { id: 'status', header: t('invoices.status') },
  { id: 'actions', header: () => h('span', { class: 'sr-only' }, t('common.actions')), meta: { class: { td: 'w-0' } } },
])
```

```vue
<section class="rounded-xl border border-default bg-default">
  <UTable :data="invoices" :columns :empty="t('invoices.none')" :loading
          :ui="{ th: 'py-2.5 text-xs font-medium whitespace-nowrap text-muted', td: 'py-3.5' }">
    <template #customer-cell="{ row }">
      <div class="flex min-w-0 items-center gap-3">
        <UAvatar :alt="row.original.customer" icon="i-lucide-building-2" class="size-9 shrink-0" :ui="{ root: 'bg-primary/10', icon: 'size-4.5 text-primary' }" />
        <p class="truncate font-medium text-highlighted">{{ row.original.customer }}</p>
      </div>
    </template>
    <template #number-cell="{ row }"><bdi dir="ltr" class="font-mono text-xs text-toned">{{ row.original.number }}</bdi></template>
    <template #total-cell="{ row }"><span class="tabular-nums">{{ money(row.original.total) }}</span></template>
    <template #status-cell="{ row }">
      <UBadge v-bind="statusOf(row.original.status)" variant="subtle" class="rounded-full whitespace-nowrap" />
    </template>
    <template #actions-cell="{ row }">
      <div class="flex items-center justify-end gap-0.5">
        <UTooltip :text="t('common.edit')">
          <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" :aria-label="t('common.edit')" @click="edit(row.original)" />
        </UTooltip>
        <UTooltip :text="t('common.delete')">
          <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" :aria-label="t('common.delete')" @click="remove(row.original)" />
        </UTooltip>
      </div>
    </template>
  </UTable>
</section>
```

- One column takes the spare width (`w-full`), actions take none (`w-0`), secondary columns hide by breakpoint.
- Clickable rows: add `thead: 'border-t border-default'` when a toolbar sits above, `tr: 'cursor-pointer
  hover:bg-muted/50'`, and keep a real button in the row for keyboard users.
- A cell built in script uses `h(resolveComponent('UBadge'), …)`; slots read better, use `h()` only for shared cells.
- Filters above: `UInput icon="i-lucide-search"`, `USelect` for a category, `UTabs :content="false"` for status
  with a count `badge: { label: '12', color: 'neutral', variant: 'subtle' }` per tab.
- Table, list and cards views: a small `UTabs` switch; keep the choice in `localStorage` inside `try`/`catch`.

## Forms

```vue
<form id="invoice-form" class="space-y-4" autocomplete="off" @submit.prevent="save">
  <div class="grid gap-4 sm:grid-cols-2">
    <UFormField :label="t('invoices.customer')" required>
      <UInput v-model.trim="form.customer" class="w-full" required />
    </UFormField>
    <UFormField>
      <template #label><FieldLabel :label="t('invoices.reference')" :hint="t('hints.reference')" /></template>
      <UInput v-model.trim="form.reference" icon="i-lucide-hash" class="w-full" />
    </UFormField>
  </div>
  <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-circle-alert" :description="error" />
</form>
```

- Every input is `w-full`; the grid sets the width.
- Passwords: `type="password"` with `autocomplete="current-password"` or `"new-password"`.
- `USwitch` with its label in `#label`. A monospace field: `:ui="{ base: 'font-mono' }"`.
- Schema validation: `UForm :schema :state @submit` takes any Standard Schema library (Zod, Valibot, Yup, Joi,
  Superstruct, Regle); errors reach the `UFormField` with the same `name` (checked 2026-11-03,
  ui.nuxt.com/docs/components/form). For a few fields, the server's 422 lines in the `UAlert` are enough.
- Unsaved drafts may live in `localStorage` under `<app>:drafts`, wrapped in `try`/`catch`.

## Modals and slideovers

```vue
<UModal v-model:open="open" :title="editing ? t('invoices.edit') : t('invoices.add')"
        :ui="{ footer: editing ? 'justify-between' : 'justify-end' }">
  <template #body><!-- the form, id="invoice-form" --></template>
  <template #footer>
    <UButton v-if="editing" :label="t('common.delete')" icon="i-lucide-trash-2" color="error" variant="ghost" @click="remove" />
    <div class="flex gap-2">
      <UButton :label="t('common.cancel')" color="neutral" variant="outline" @click="open = false" />
      <UButton type="submit" form="invoice-form" :label="t('common.save')" :loading="saving" />
    </div>
  </template>
</UModal>
```

- `form="invoice-form"` lets the footer button submit the form in the body; Enter submits too.
- Reset the form in `watch(open, isOpen => …)` when it **opens**: resetting on close shows the empty form during
  the closing animation.
- Wide content: `:ui="{ content: 'sm:max-w-5xl' }"`. Body spacing: `:ui="{ body: 'space-y-4' }"`.
- `USlideover` has the same slots plus `side`; use it for details next to a list or a long form:
  `:ui="{ content: 'w-full max-w-none sm:max-w-3xl' }"`.
- Confirm: `if (await confirm({ title, confirmLabel, danger: true })) { … }`. Skip `description` unless the
  title alone would mislead.

## Tabs

- A segmented switch: `<UTabs v-model="metric" :items :content="false" size="xs" />`, items `{ label, value }`.
- Section tabs on a screen: `variant="link"`, items with an `icon`.
- Content tabs: each item gets a `slot` name; fill `#<slot>`.
- Many tabs on a phone: wrap in `<div class="overflow-x-auto">` and give `UTabs` `class="mx-auto w-max"`
  (or `:ui="{ list: 'w-max' }"`).

## Empty states

`<EmptyState icon="i-lucide-receipt" :title="t('invoices.empty')">` with the primary action and a neutral
outline second action in the slot. In a table use `:empty`; in a chart a
`grid h-48 place-items-center text-sm text-muted` line.

## Toasts

```ts
const toast = useToast()
toast.add({ title: t('invoices.saved'), color: 'success', icon: 'i-lucide-check' })
toast.add({ title: t('invoices.saveFailed'), description: (error as Error).message, color: 'error' })
toast.add({ title: t('invoices.partly'), description: lines.join('\n'), color: 'warning', icon: 'i-lucide-triangle-alert' })
```

Position once on `<UApp :toaster="{ position: 'bottom-center' }">`. Copy buttons use `useCopy()`.

## Loading and freshness

- `USkeleton` blocks shaped like the content (title `h-8 w-56`, card `h-32 w-full rounded-xl`). A centred
  `i-lucide-loader-circle animate-spin text-muted` only for the first boot of the whole app.
- Buttons that start work get `:loading`.
- Data older than 30 s refetches silently (no skeletons) on `focus` and `visibilitychange`. Poll (60 s) only while
  something waits on an outside system. Remove listeners and the interval in `onBeforeUnmount`.
- The refresh button's tooltip shows the time of the last load.

## Alerts

`UAlert color="error" variant="subtle" icon="i-lucide-circle-alert" :title :description` above what it concerns.
Show the server's translated message, never a stack or a vendor payload. A row with a problem shows a
`color="error"` badge with the message in a `UTooltip`.

## Charts

Plain `div` bars, no chart library, colours from the chart tokens ([theme.md](theme.md#charts)).

```vue
<div class="rounded-xl border border-default bg-default p-5">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h3 class="font-semibold text-highlighted">{{ title }}</h3>
    <ul v-if="series.length > 1" class="flex flex-wrap gap-3 text-xs text-toned">
      <li v-for="s in series" :key="s.name" class="inline-flex items-center gap-1.5">
        <span class="size-2.5 rounded-sm" :style="{ background: s.color }" /> {{ s.name }}
      </li>
    </ul>
  </div>
  <div class="mt-5 flex gap-3">
    <div class="relative h-48 min-w-0 flex-1">
      <div v-for="tick in ticks" :key="tick" class="absolute inset-x-0 border-t border-default" :style="{ top: `${100 - (tick / top) * 100}%` }" />
      <div class="absolute inset-0 flex items-end gap-0.5">
        <UTooltip v-for="(p, i) in points" :key="p.key" :text="tooltip(p)" :delay-duration="0">
          <div class="group flex h-full flex-1 items-end justify-center">
            <div class="w-full max-w-6 rounded-t-[4px] bg-(--chart-bar) transition-opacity group-hover:opacity-80"
                 :style="{ height: `${(p.value / top) * 100}%`, minHeight: p.value ? '2px' : '0' }" />
          </div>
        </UTooltip>
      </div>
    </div>
    <div class="flex h-48 w-12 shrink-0 flex-col justify-between text-[11px] text-muted tabular-nums" dir="ltr">
      <span v-for="tick in ticks" :key="tick">{{ format(tick) }}</span>
    </div>
  </div>
  <table class="sr-only"><caption>{{ title }}</caption><!-- same numbers as rows --></table>
</div>
```

- Three gridlines: 0, half, a rounded top. Non-zero bars at least 2px tall.
- Stacked series: a `flex flex-col-reverse overflow-hidden rounded-t-[4px]` column with one segment per series,
  `gap-px` between columns.
- Day labels under the bars: first and last always, others every fifth from `sm`; edge labels anchored with
  `start-0` / `end-0`.

## Accessibility

- Icon-only buttons: `aria-label`, plus a `UTooltip` when the icon is not obvious.
- Current nav item: `aria-current="page"`. Decorative images `alt=""`; screenshots say what they show.
- Colour never carries meaning alone: a status badge has a label and an icon.
- Nuxt UI overlays trap focus and close on Escape; don't rebuild them from `div`s.
- Contrast for any new token pair in both modes: 4.5:1 for text, 3:1 for large text and UI marks.
- Custom animation respects `prefers-reduced-motion`.
