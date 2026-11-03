# Lists

**Read when:** building an index page, a queue, a log, or any table of records.
**Owns:** the index page shape, the toolbar and its filters, the "no filter" value, pagination, the
table's cells, the empty state, long lists.

## TL;DR

- A list renders one server page of rows. Filtering, sorting and paging happen on the server.
- Filters live in the URL through `useListFilters`; they apply as you type, debounced.
- A select's "no filter" value is the `ALL` sentinel (`'__all__'`), never `''`.
- The first cell links to the record; the last cell holds the row actions.
- The status has its own column, as a `StatusBadge`.
- No rows is an empty row inside the table that says what to do next.

## Shape

```
shell header   breadcrumb ─────────────────────────── [ + New invoice ]
toolbar        search · faceted filter · faceted filter · [Reset]
Card           table: head on bg-muted, rows …            [👁] [✎] [🗑] [⋯]
footer         Showing 1–20 of 240 · Rows per page [20] · Page 1 of 12 · ‹ ›
```

```vue
<script setup lang="ts">
const props = defineProps<{ invoices: Paginated<InvoiceRow>; filters: Partial<InvoiceFilters>; statuses: FacetOption[] }>();
const { t } = useTranslations();

setLayoutProps({ breadcrumbs: [{ title: t('invoices.title') }] });

const { filters, dirty, clear } = useListFilters(invoices.index().url, {
    search: props.filters.search ?? '',
    status: props.filters.status ?? '',
});
</script>

<template>
    <Head :title="t('invoices.title')" />

    <PageHeader :title="t('invoices.title')">
        <template v-if="can('invoices.create')" #actions>
            <Link :href="invoices.create().url" :class="buttonVariants()"><PlusIcon />{{ t('invoices.new') }}</Link>
        </template>
    </PageHeader>

    <DataTable :paginator="invoices" :colspan="5">
        <template #toolbar>
            <Input v-model="filters.search" :placeholder="t('common.search')" class="h-8 w-40 lg:w-64" />
            <DataTableFacetedFilter v-model="filters.status" :title="t('fields.status')" :options="statuses" />
            <Button v-if="dirty" variant="ghost" size="sm" @click="clear">{{ t('common.reset') }}<XIcon /></Button>
        </template>

        <template #head>
            <TableHead>{{ t('fields.number') }}</TableHead>
            <TableHead>{{ t('fields.customer') }}</TableHead>
            <TableHead>{{ t('fields.status') }}</TableHead>
            <TableHead class="text-end">{{ t('fields.total') }}</TableHead>
            <TableHead class="w-32" />
        </template>

        <template #empty>{{ t('invoices.empty') }}</template>

        <template #rows>
            <TableRow v-for="invoice in invoices.data" :key="invoice.id">
                <TableCell class="font-medium">
                    <Link :href="invoices.show(invoice.id).url" class="hover:underline">{{ invoice.number }}</Link>
                </TableCell>
                <TableCell>{{ invoice.customer_name }}</TableCell>
                <TableCell><StatusBadge :tone="invoice.status.tone" :label="invoice.status.label" /></TableCell>
                <TableCell class="text-end tabular-nums" dir="ltr">{{ invoice.total }}</TableCell>
                <TableCell>
                    <RowActions
                        :label="invoice.number"
                        :view="invoices.show(invoice.id).url"
                        :edit="can('invoices.update') ? invoices.edit(invoice.id).url : null"
                        :destroy="can('invoices.delete') ? { href: invoices.destroy(invoice.id).url, title: t('invoices.confirm_delete') } : null"
                    />
                </TableCell>
            </TableRow>
        </template>
    </DataTable>
</template>
```

`DataTable`, `DataTableFacetedFilter`, `RowActions` and `useListFilters` are in
[house-components.md](house-components.md).

## Server-driven, always

- **Never filter or sort a page of rows in the browser.** It searches one page and claims the rest
  did not match, and it sidesteps the server's access scoping.
- **No client-side sort.** A sortable column sends a `sort` key that the filter request validates
  and the query applies, like any other filter.
- **Every filter key has a rule in the index Form Request**, or `validated()` drops it and the filter
  silently does nothing. The controller echoes `validated()` back as `filters`.
- Plain table primitives with `v-for` are enough for a paginated, server-filtered list. Add a headless
  table library only for a need the server cannot serve (column visibility saved per browser, a
  virtualised log).

## Filters

- **They apply as you type**, debounced 300ms, the way shadcn's data-table toolbar behaves. Each
  change is a round-trip, hence the debounce; `router.get` to the bare list URL drops `page`, so a
  narrowed list never strands the reader on a page that no longer exists.
- A filter over a fixed option set is a `DataTableFacetedFilter` (outline, `size="sm"`,
  `border-dashed`), a search is a plain `Input class="h-8 w-40 lg:w-64"`, and the toolbar row is
  `flex flex-wrap items-center gap-2` above the table card.
- **Reset** is a `ghost`, `size="sm"` button that shows only while `dirty` (a filter differs from its
  default).
- **The "no filter" value of a `Select` is `ALL` (`'__all__'`)**, exported beside `useListFilters`,
  which strips it from the query. Reka's `SelectItem` refuses an empty value, and `''` cannot be told
  apart from a cleared text box. `'__all__'` rather than a word such as `'any'`, because no real
  option value will collide with it.
- Query names follow the columns: the column (`customer_id`), a plural for several values
  (`statuses`), `from` / `to` for a date range. No `filter_` prefix.

## Cells

- **The first cell links** to the same place View goes. It is the one people click, and it keeps the
  list keyboard-navigable in reading order.
- **Status in its own column** as a `StatusBadge`, never a bare word.
- **Numbers and money** take `text-end tabular-nums` and `dir="ltr"`, so digits line up and keep
  their order in Arabic.
- **A date** is a `DateTimeValue`: the date, the time under it.
- **Missing is an em dash** in `text-muted-foreground`, never an empty cell.
- **An id column** is `w-16 text-muted-foreground tabular-nums`; the actions column `w-32` or
  narrower, with an empty `TableHead`.
- **Stable `:key`** on every row: the record id, never the index.
- Long text wraps in its cell (`whitespace-normal`); the table scrolls inside its card on a phone
  rather than squeezing every column.

## Row actions

Last cell, right-aligned: view, edit, delete as ghost `icon-sm` buttons in that order, then a `⋯`
menu for everything else. The rule and its reasons are in
[actions-and-feedback.md](actions-and-feedback.md#three-actions-then-).

## Empty and loading

- **No rows:** the table keeps its header and shows one muted row across every column, with one
  sentence naming the next action: "Try another search, or clear the filters." A list that has never
  had rows says how to create the first one. Never a bare "No results".
- **A section with nothing to show** (not a table) is an `EmptyState`: icon tile, title, one line, and
  the button that ends the emptiness in its slot.
- **Loading** is `Skeleton`s shaped like what will replace them: a bar per cell, sized to that column's
  usual width. Rows that arrive as a deferred prop show skeleton rows meanwhile. Never a spinner in
  place of content.
- A table that swaps skeletons for data keeps its column widths: `table-fixed` with a `<colgroup>`,
  so the headers do not jump.

## Long lists

A list past a few hundred rows on one screen renders through a virtualiser, keeps each cell as text
until it is clicked, and never mounts a combobox or popover per cell up front. A paginated index never
needs this; a log or an editable grid may.

## Self-check

- [ ] Data, page and filters arrive as props; nothing filtered or sorted in the browser.
- [ ] Filters in the URL through `useListFilters`; every key validated on the server.
- [ ] Select "no filter" is `ALL`; Reset shows only while `dirty`.
- [ ] First cell links; status is a badge; numbers `text-end tabular-nums`.
- [ ] Empty row with a next step; skeletons while loading.
