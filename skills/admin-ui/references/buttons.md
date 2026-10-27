# Buttons and badges

Which variant, which size, where the icon goes, what a busy button looks like, and how a status
is shown.

## Button variants

| Variant | For | Looks like |
|---|---|---|
| `default` | the one main action on the screen | solid `--primary` |
| `secondary` | the action beside it | filled grey |
| `outline` | a toolbar control, a filter, a picker trigger | bordered, transparent |
| `ghost` | a row action, an icon in a dense place | no chrome until hover |
| `destructive` | delete, drop, revoke | tinted by default; see below |
| `link` | inline in a sentence | underline on hover |

Some registry styles ship `destructive` as a tint. That reads right on a `DropdownMenuItem` and too
quiet on the button that actually deletes. Define a solid treatment **once**, as a class in
`lib/button.ts`, and pass it:

```vue
<Button variant="destructive" :class="solidDestructive">{{ t('pages.delete_customer') }}</Button>
```

It is a class rather than an edit to `components/ui/button`, because the CLI rewrites that file.
Use `--destructive-foreground`, not `text-white`, so it still inverts with the theme. Apply it in
the confirm dialog's confirm button too.

## Sizes

`xs` · `sm` · `default` · `lg`, and the square `icon-xs` · `icon-sm` · `icon` · `icon-lg`.

- Row actions in a table: `size="icon-sm"`, `variant="ghost"`.
- A toolbar control: `size="sm"`.
- Anything else: the default.

## One width for committing actions

A form's submit and the button in each danger-zone footer take the same class (`equalAction`,
for example `min-w-48 justify-center`), so a column of them reads as a set:

```vue
<Button type="submit" :class="equalAction">…</Button>
<Button variant="destructive" :class="cn(solidDestructive, equalAction)">…</Button>
```

It is a minimum, so a longer label still fits; keep labels short enough that none outgrows it.
Toolbar controls, row actions and header links are not in this set and stay content-sized.

## Labels: the verb, not the sentence

«إضافة», not «إنشاء وتجهيز». «إعادة البناء», not «حذف القاعدة وإعادة البناء». The card title and
its description already say what the thing is and what will happen. Short labels also keep every
committing action inside the shared width.

## Three actions, then `⋯`

The same shape everywhere, so a reader never hunts:

| Where | Shows | Goes in the `⋯` menu |
|---|---|---|
| a table row | view · edit · delete, as `icon-sm` ghost icons, in that order | everything else |
| a page header | the one primary action for the screen | every other action |

- Delete is a `Trash2Icon` ghost `icon-sm` with `text-destructive hover:text-destructive`, always
  wrapped in the confirm dialog.
- An action that doesn't exist is simply absent (no Show screen, no eye), and the survivors keep
  their order instead of sliding over.
- Never a fourth inline icon. The `⋯` costs one click and keeps the column the same width on every
  row, which is what makes a long table scannable.

## No Cancel

A form has one button. Cancel is navigation, and the breadcrumb and sidebar already do it; a second
button beside the submit only competes with it. A dialog's own cancel is provided by
`AlertDialogCancel`.

## Every action button carries its icon

```vue
<Button>
    <PlusIcon />
    {{ t('common.create') }}
</Button>
```

| Action | Icon |
|---|---|
| create | `PlusIcon` |
| save | `SaveIcon` |
| delete | `Trash2Icon` |
| edit | `PencilIcon` |
| sync, reprovision | `RefreshCwIcon` |
| suspend · activate | `PauseIcon` · `PlayIcon` |
| rebuild | `RotateCcwIcon` |
| expand · collapse | `ChevronsUpDownIcon` · `ChevronsDownUpIcon` |

- **No size class on an icon inside a button or badge.** The component sizes it per button size; a
  `size-4` you add freezes it at one size. Place it with `data-icon="inline-start"` or
  `data-icon="inline-end"` where the component supports that.
- An icon-only button needs an accessible name: `:title` for the tooltip **and** an `aria-label`
  (or an `sr-only` span).

## Busy

There is no `loading` prop. Swap the icon for a spinner and disable:

```vue
<Button type="submit" :disabled="form.processing">
    <Spinner v-if="form.processing" />
    <SaveIcon v-else />
    {{ t('common.save') }}
</Button>
```

## A link that looks like a button

Inertia navigation is `<Link>`, so take the look from `buttonVariants()` rather than wrapping a
`<Button>` in a link:

```vue
<Link :href="admin.customers.create().url" :class="buttonVariants()">
    <PlusIcon />
    {{ t('pages.new_customer') }}
</Link>

<Link :href="admin.customers.edit(id).url" :class="buttonVariants({ variant: 'ghost', size: 'icon-sm' })" :title="t('common.edit')" :aria-label="t('common.edit')">
    <PencilIcon />
</Link>
```

## Badges

Same variant names, one shape: `default`, `secondary` (the usual), `outline`, `destructive`
(tinted), `ghost`, `link`.

A **status** never picks its own variant. It renders `<StatusBadge :tone :label>`, where `tone`
comes from the server (an enum case such as `success`, `warning`, `danger`, `neutral`) and one
client map (`lib/tone.ts`) decides the look. A status that changes meaning then changes in one
place on the server.
