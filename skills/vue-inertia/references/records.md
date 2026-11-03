# Record pages

**Read when:** building a show page, or deciding where a record's facts, sections and verbs go.
**Owns:** the two record layouts and when each fits, the facts grid, how values are displayed, the
record header, the verbs that end a record, toggles versus one-way decisions, sections and the danger
zone.

## TL;DR

- A record is never a `Table`. `Table` is for a list of records, where columns repeat.
- Pick the layout by what the record is: a set of fields gets a **facts grid**; a record with a body
  and a decision gets **main column + aside**.
- Each fact is a `DetailCard`: icon, muted label, the value under it. Dates on two lines, values never
  truncated, names instead of ids.
- The status sits beside the title, never among the actions.
- The page header holds one primary action; the rest go behind `⋯`, delete last.
- Verbs that end a record sit at the foot, beside the note box. Which states are offered comes from
  the server.

## Which layout

| The record is… | Layout | Example |
|---|---|---|
| a set of fields people look up and edit | facts grid, sections in `Tabs`, danger zone below | Customer, Product |
| a thing with a body, a thread or a decision | main column + aside of facts | Order awaiting approval, a support request |

Both keep the facts as facts (label and value), both put the status by the title, and both keep
destructive actions out of tabs and menus that hide them.

### Facts grid

```vue
<template>
    <Head :title="customer.name" />
    <PageHeader :title="customer.name">
        <template #actions>
            <Link v-if="can('customers.update')" :href="customers.edit(customer.id).url" :class="buttonVariants()">
                <PencilIcon />{{ t('common.edit') }}
            </Link>
        </template>
    </PageHeader>

    <Tabs default-value="details" class="gap-4">
        <TabsList>
            <TabsTrigger value="details">{{ t('customers.details') }}</TabsTrigger>
            <TabsTrigger value="contact">{{ t('customers.contact') }}</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
            <div class="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailCard :label="t('fields.status')" :icon="ActivityIcon">
                    <StatusBadge :tone="customer.status.tone" :label="customer.status.label" />
                </DetailCard>
                <DetailCard v-for="row in detailRows" :key="row.label" :label="row.label" :icon="row.icon">
                    <span v-if="row.value" :dir="row.ltr ? 'ltr' : undefined">{{ row.value }}</span>
                    <span v-else class="text-muted-foreground">—</span>
                </DetailCard>
            </div>
        </TabsContent>
        <TabsContent value="contact">…</TabsContent>
    </Tabs>

    <DangerZone v-if="can('customers.delete')" :title="t('customers.delete_title')" :description="t('customers.delete_help')">
        <ConfirmAction :href="customers.destroy(customer.id).url" method="delete" :title="t('customers.confirm_delete')"
            :description="t('customers.confirm_delete_help')" :confirm-label="t('common.delete')">
            <Button variant="destructive" :class="cn(solidDestructive, equalAction)"><Trash2Icon />{{ t('common.delete') }}</Button>
        </ConfirmAction>
    </DangerZone>
</template>
```

- **Sections of the record's own fields go in `Tabs`**, so the page stays one screen tall. Sections
  that act **on** the record (status change, delete) stay below as always-visible cards: a
  destructive control hidden behind a tab is how it gets missed.
- With one section, drop the `Tabs` and keep the grid.

### Main column + aside

```
grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]
├─ main   Card: the record itself (its lines, its message, its history)
│         Card: the note box + the deciding verbs        ← at the foot
└─ aside  Card per group of facts: what it is · who it belongs to · its outcome
```

- The aside is facts, not actions: each row a `dt` / `dd` pair on one line, label
  `text-xs text-muted-foreground`, value `text-xs font-medium`. Links to related records live here,
  each ending in an `ExternalLinkIcon` when it leaves the app.
- `minmax(0,1fr)` lets long content in the main column wrap instead of pushing the aside off-screen.

## Showing a value

- **A date and its time go on two lines** (`DateTimeValue`). Never `2026-09-21 16:58:18` on one line,
  where the eye has to find the split in a run of digits.
- **A value is never truncated.** A URL or a code is the point of the card, so it wraps (`break-all`).
- **Show the name, not the key.** The controller sends `customer_name`, not `customer_id`.
- **Every card has an icon**, so the grid scans by shape before it is read.
- **Missing is an em dash** in `text-muted-foreground`, never a blank.
- **Latin values in an Arabic page** (codes, emails, URLs, numbers) sit in `dir="ltr"`
  ([rtl-and-bidi.md](rtl-and-bidi.md)).
- **Data the viewer may not see** is left out of the props, not hidden in the template.

## The header

- **The status is a `StatusBadge` beside the title** or in the first fact card, never in the actions
  slot. A status is not something you press.
- **One primary action** (usually Edit) as a button; everything else in a `⋯` menu after it, with
  delete last and `variant="destructive"` on its menu item. A record whose primary action finishes it
  (Publish on a draft) shows that one instead.
- Each action renders only when `can()` or the record's `can_*` allows it.

## Verbs that end a record

Approve, decline, close: the decisions the page exists for.

- **They sit at the foot of the main column, beside the note box**, so what was typed above becomes
  the reason, with no second dialog asking for one.
- **The negative verb is an outline button with a red icon** (`<XIcon class="text-destructive" />`);
  the positive one is solid. Never a solid red button for a refusal: the destructive style is for
  deletes, and it would outrank everything else on the page.
- **The offered states come from the server.** The controller sends the transitions reachable from
  the current state; the page renders what it was given. A page with its own hardcoded list will one
  day offer a state the server refuses.

## Toggle or one-way door

Decide by what the action changes.

- **An edit, a note, a label** can be reopened and corrected the way editing normally works. Do not
  lock it read-only after the first save.
- **A decision that moves something else** (charges a card, changes a plan, sends mail) is one-way.
  The server checks the live state inside the same lock that performs the transition, not only in the
  form that calls it today, and the page offers no button to flip it back. A wrong decision is fixed
  through the thing it changed, not by reversing the request that caused it.

## After an action

A write redirects (to the same record, or to the index after a delete) and flashes a toast naming
what happened. A dialog that stays on the record reloads only its slice with `only: [...]`.

## Self-check

- [ ] No `Table` for a single record; the layout matches the record.
- [ ] Facts are `DetailCard`s (or `dt`/`dd` rows in the aside) with icons, dates on two lines,
      names not ids, em dash for missing.
- [ ] Status beside the title; one primary action, the rest behind `⋯`, delete last.
- [ ] Deciding verbs at the foot; outline + red icon for the negative one; states from the server.
- [ ] The danger zone is below the tabs, never inside one.
