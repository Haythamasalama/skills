# Components and layout

Patterns that held up in a Nuxt UI 4 dashboard and a landing page. Checked 2026-10-27.
All classes are tokens from [theme.md](theme.md); all strings go through `t()` from [i18n-rtl.md](i18n-rtl.md).

## Dashboard shell

Two ways to build it.

**Hand-built** (full control, little code):

```vue
<template>
  <div class="min-h-screen bg-muted lg:flex">
    <aside class="hidden w-64 shrink-0 flex-col gap-6 px-3 py-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
      <AppBrand class="px-2" />
      <nav>
        <button
          v-for="item in nav"
          :key="item.value"
          type="button"
          class="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="screen === item.value ? 'bg-elevated text-highlighted' : 'text-toned hover:bg-elevated/70'"
          :aria-current="screen === item.value ? 'page' : undefined"
          @click="screen = item.value"
        >
          <UIcon :name="item.icon" class="size-4.5" /> {{ item.label }}
        </button>
      </nav>
      <USeparator />
      <!-- secondary list: accounts, projects, ... -->
    </aside>

    <div class="flex min-w-0 flex-1 flex-col gap-3 p-3 lg:ps-0">
      <header class="flex flex-wrap items-center justify-between gap-3 px-1 lg:min-h-10">
        <div class="flex min-w-0 items-center gap-2 lg:hidden">
          <AppBrand compact />
          <USelect v-model="screen" :items="navItems" class="w-52 max-w-full" :aria-label="t('nav.picker')" />
        </div>
        <span class="hidden lg:block" />
        <HeaderTools />
      </header>

      <main class="flex-1 space-y-6 rounded-2xl border border-default bg-default p-4 sm:p-6 lg:p-8">
        <!-- the screen -->
      </main>

      <AppFooter />
    </div>
  </div>
</template>
```

- Under `lg`, one `USelect` replaces the sidebar. Mixing screens and records in one select works with sentinel
  values that a real id cannot take (`*` for the overview, `+` for a management screen, `#` for settings).
- `min-w-0` on the flex child that holds tables and long text, or it overflows instead of shrinking.

**Nuxt UI dashboard components** (collapsible and resizable sidebar, search palette, navbar and toolbar):

```vue
<!-- layouts/dashboard.vue -->
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <UNavigationMenu :items="links" orientation="vertical" />
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>

<!-- pages/index.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="t('nav.overview')" />
      <UDashboardToolbar />
    </template>
    <template #body>
      <!-- content -->
    </template>
  </UDashboardPanel>
</template>
```

Choose these when the app has many pages and routes. Choose the hand-built shell for a single-screen tool.

### Header tools

A small group of ghost buttons in a bordered pill:

```vue
<div class="flex items-center gap-1 rounded-lg border border-default bg-default p-1">
  <UTooltip :text="t('header.refresh')">
    <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="sm" :aria-label="t('header.refresh')" :loading="refreshing" @click="refresh()" />
  </UTooltip>
  <UTooltip :text="t('header.language')">
    <UButton :label="lang === 'ar' ? 'EN' : 'AR'" color="neutral" variant="ghost" size="sm" class="font-mono font-semibold" :aria-label="t('header.language')" @click="toggleLang()" />
  </UTooltip>
  <UTooltip :text="t('header.colorMode')">
    <UColorModeButton size="sm" />
  </UTooltip>
</div>
```

The language button shows the language you switch **to**.

## Page header

```vue
<div class="flex flex-wrap items-start justify-between gap-3">
  <div class="min-w-0">
    <h1 class="text-2xl font-bold text-highlighted">{{ title }}</h1>
    <p class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <span class="inline-flex items-center gap-1.5">
        <UIcon name="i-lucide-phone" class="size-3.5 text-dimmed" /> <bdi dir="ltr">{{ phone }}</bdi>
      </span>
    </p>
  </div>
  <div class="flex flex-wrap gap-2">
    <UButton :label="t('x.import')" icon="i-lucide-upload" color="neutral" variant="outline" />
    <UButton :label="t('x.add')" icon="i-lucide-plus" />
  </div>
</div>
```

One primary button, on the end. The rest are neutral outline.

## Cards

- Section: `<section class="space-y-4 rounded-xl border border-default bg-default p-5">` and
  `<h2 class="font-semibold text-highlighted">`.
- Grid of sections: `grid gap-4 lg:grid-cols-2`.
- Key-value list inside a card:
  `<dl class="divide-y divide-default rounded-lg border border-default text-sm">` with rows
  `flex items-center justify-between gap-3 px-4 py-2.5`, `dt.text-muted`, `dd.text-highlighted`.
- A card that opens something: the whole card is a `button` or link, with `hover:shadow-md` and a visible focus ring.

## Stat tile

```vue
<script setup lang="ts">
defineProps<{ title: string, icon: string, hint?: string, loading?: boolean }>()
</script>

<template>
  <div class="flex items-start justify-between gap-3 rounded-xl border border-default bg-default p-5">
    <div class="min-w-0 flex-1">
      <p class="flex items-center gap-1.5 text-sm text-toned">
        {{ title }}
        <UTooltip v-if="hint" :text="hint"><UIcon name="i-lucide-info" class="size-3.5 text-dimmed" /></UTooltip>
      </p>
      <div v-if="loading" class="mt-3 space-y-2">
        <USkeleton class="h-7 w-28" />
        <USkeleton class="h-3.5 w-36" />
      </div>
      <div v-else class="mt-2"><slot /></div>
    </div>
    <div class="grid size-10 shrink-0 place-items-center rounded-lg border border-default bg-muted text-toned">
      <UIcon :name="icon" class="size-5" />
    </div>
  </div>
</template>
```

The value goes in the slot: `text-2xl font-semibold text-highlighted tabular-nums`, then a `text-xs text-muted` line.

## Tables

```ts
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const columns = computed<TableColumn<Row>[]>(() => [
  { id: 'name', header: t('table.name'), meta: { class: { td: 'w-full min-w-56' } } },
  { id: 'owner', header: t('table.owner'), meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  { id: 'id', header: 'ID', meta: { class: { th: 'hidden lg:table-cell', td: 'hidden lg:table-cell' } } },
  { id: 'status', header: t('table.status') },
  { id: 'actions', header: () => h('span', { class: 'sr-only' }, t('table.actions')), meta: { class: { td: 'w-0' } } },
])
```

```vue
<section class="rounded-xl border border-default bg-default">
  <UTable :data="rows" :columns="columns" :empty="t('table.empty')" :loading="loading"
          :ui="{ th: 'py-2.5 text-xs font-medium whitespace-nowrap text-muted', td: 'py-3.5' }">
    <template #id-cell="{ row }">
      <bdi dir="ltr" class="font-mono text-xs text-toned">{{ row.original.id }}</bdi>
    </template>
    <template #status-cell="{ row }">
      <UBadge v-bind="statusOf(row.original.status)" variant="subtle" class="rounded-full whitespace-nowrap" />
    </template>
    <template #actions-cell="{ row }">
      <div class="flex items-center justify-end gap-0.5">
        <UTooltip :text="t('table.edit')">
          <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="sm" :aria-label="t('table.edit')" @click="edit(row.original)" />
        </UTooltip>
        <UTooltip :text="t('table.delete')">
          <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" :aria-label="t('table.delete')" @click="remove(row.original)" />
        </UTooltip>
      </div>
    </template>
  </UTable>
</section>
```

- Columns are `computed` so headers change with the language.
- One column takes the spare width (`w-full`), the actions column takes none (`w-0`).
- For a cell built in script (`cell: ({ row }) => ...`), get components with `resolveComponent('UBadge')` and
  render with `h()`. Slots read better; use `h()` only for cells shared across views.
- Filters above the table: `UInput` with `icon="i-lucide-search"`, `USelect` for category, and `UTabs` for status
  with a count badge per tab (`badge: { label: '12', color: 'neutral', variant: 'subtle' }`).
- Offer table / list / cards views with a small segmented control, and keep the choice in `localStorage` inside
  `try`/`catch` (storage can be blocked).

## Forms

```vue
<form id="item-form" class="space-y-4" autocomplete="off" @submit.prevent="save">
  <div class="grid gap-4 sm:grid-cols-2">
    <UFormField :label="t('form.name')" required>
      <UInput v-model.trim="form.name" class="w-full" required />
    </UFormField>
    <UFormField>
      <template #label>
        <FieldLabel :label="t('form.url')" :hint="t('form.urlHint')" />
      </template>
      <UInput v-model.trim="form.url" icon="i-lucide-link" placeholder="https://example.com" class="w-full" />
    </UFormField>
  </div>
  <UAlert v-if="error" color="error" variant="subtle" icon="i-lucide-circle-alert" :description="error" />
</form>
```

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

- Every input is `w-full`; the grid decides the width.
- Hints sit behind the info icon. The form stays short and calm.
- Passwords: `type="password"` with `autocomplete="current-password"` or `"new-password"`.
- Switches: `USwitch` with the label in its `#label` slot.
- Schema validation: `UForm :schema :state` accepts Standard Schema libraries (Zod, Valibot). For a few fields,
  a server 422 with one problem per line, shown in the `UAlert`, is enough.
- A long token field can trigger a lookup after a pause (`watch` + `setTimeout` 500ms) once it looks complete.

## Modals and slideovers

```vue
<UModal v-model:open="open" :title="editing ? t('item.edit') : t('item.add')"
        :ui="{ footer: editing ? 'justify-between' : 'justify-end' }">
  <template #body>
    <!-- the form above, with id="item-form" -->
  </template>
  <template #footer>
    <UButton v-if="editing" :label="t('item.delete')" icon="i-lucide-trash-2" color="error" variant="ghost" @click="remove" />
    <div class="flex gap-2">
      <UButton :label="t('common.cancel')" color="neutral" variant="outline" @click="open = false" />
      <UButton type="submit" form="item-form" :label="t('common.save')" :loading="saving" />
    </div>
  </template>
</UModal>
```

- `form="item-form"` lets the footer button submit the form in the body. Enter in a field submits too.
- Reset the form in a `watch(open, isOpen => ...)` when it opens, not when it closes (the closing animation would
  show the empty form).
- `USlideover` has the same shape (`v-model:open`, `title`, `#body`, `#footer`, plus `side`). Use it for long forms
  or details next to a list.

### Confirm before anything destructive

```ts
// composables/useConfirm.ts
import { ConfirmModal } from '#components'

export function useConfirm() {
  const overlay = useOverlay()

  return (props: { title: string, description?: string, confirmLabel?: string, danger?: boolean }): Promise<boolean> =>
    overlay.create(ConfirmModal, { destroyOnClose: true, props }).open().then(Boolean)
}
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
      <UButton :label="confirmLabel ?? t('common.continue')" :icon="danger ? 'i-lucide-trash-2' : undefined"
               :color="danger ? 'error' : 'primary'" @click="emit('close', true)" />
    </template>
  </UModal>
</template>
```

Use: `if (await confirm({ title: t('item.deleteTitle'), confirmLabel: t('item.delete'), danger: true })) { ... }`.
Skip `description` unless the title alone would mislead.

## Tabs

- As a segmented switch: `<UTabs v-model="metric" :items="items" :content="false" size="xs" />`, where
  `items = [{ label, value }]`.
- As content tabs: give each item a `slot` name and fill `#<slot>` templates.
- Many tabs on a phone:

  ```vue
  <div class="overflow-x-auto">
    <UTabs v-model="current" :items="tabs" :content="false" class="mx-auto w-max" />
  </div>
  ```

## Empty states

```vue
<div class="grid place-items-center gap-3 py-20 text-center">
  <span class="grid size-14 place-items-center rounded-full bg-elevated text-muted">
    <UIcon name="i-lucide-folder-plus" class="size-6" />
  </span>
  <p class="font-semibold text-highlighted">{{ t('items.empty') }}</p>
  <div class="flex flex-wrap justify-center gap-2">
    <UButton :label="t('items.add')" icon="i-lucide-plus" @click="add" />
    <UButton :label="t('items.import')" icon="i-lucide-upload" color="neutral" variant="outline" @click="importFile" />
  </div>
</div>
```

Inside a table use `:empty`. Inside a chart, a `grid h-48 place-items-center text-sm text-muted` line.

## Toasts

```ts
const toast = useToast()
toast.add({ title: t('item.saved'), color: 'success', icon: 'i-lucide-check' })
toast.add({ title: t('item.saveFailed'), description: (error as Error).message, color: 'error' })
```

- Position once on `<UApp :toaster="{ position: 'bottom-center' }">`.
- A copy helper shows its own toast:

  ```ts
  export function useCopy() {
    const toast = useToast()
    return async (text: string) => {
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

- On a landing page, swap the button icon to a check for two seconds instead of a toast.

## Loading and freshness

- `USkeleton` blocks shaped like the content (a title bar, a card, table rows). A spinner only for the first boot
  of the whole app (`i-lucide-loader-circle animate-spin`).
- Buttons that start work get `:loading`.
- Data older than about 30 seconds refetches when the tab regains focus (`focus` and `visibilitychange`), silently,
  without skeletons. Poll (about 60 seconds) only while something is waiting on an outside system.
  Remove the listeners and the interval in `onBeforeUnmount`.
- Show "updated at" in the refresh button's tooltip.

## Alerts and inline errors

- `UAlert color="error" variant="subtle" icon="i-lucide-circle-alert" :title :description` above the content it
  concerns. Server errors arrive already translated; show the message, never a raw stack or vendor payload.
- A row with a problem shows `i-lucide-circle-alert text-error` with the message in a tooltip.

Landing page sections (hero, feature grid, steps, FAQ, footer) are in [static-seo.md](static-seo.md).
