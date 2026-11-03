# Actions and feedback

**Read when:** putting a button, a menu, a delete, a dialog, a toast or a status on screen.
**Owns:** button variants, sizes and icons, busy buttons, links that look like buttons, where each
verb goes ("three actions, then `⋯`"), absent versus disabled, the delete flow, dialogs, toasts,
alerts by meaning, status badges and their tones.

## TL;DR

- One primary (`default`) button per screen. A list header carries at most one verb: create.
- A row shows view · edit · delete, then `⋯`. A record header shows one action, then `⋯`.
- A verb the viewer may not use is absent, not disabled.
- Every action button carries its icon; a busy one swaps it for a spinner and disables.
- Destructive actions go through `ConfirmAction`, which names the record.
- Toasts come only from the flash listener. They report outcomes; they never ask for a decision.
- A status is a `StatusBadge` whose tone the server chooses: `ok`, `warn`, `danger`, `info`, `idle`.

## Button variants and sizes

| Variant | For |
|---|---|
| `default` | the one main action on the screen: create, save |
| `secondary` | an action beside it that is not the main one |
| `outline` | a toolbar control, a filter, a picker trigger, the negative of a decision |
| `ghost` | a row action, an icon in a dense place, Reset in a toolbar |
| `destructive` | the button that deletes, with `solidDestructive` where the style ships it as a tint |
| `link` | inline in a sentence |

| Where | Size |
|---|---|
| page-header action, form submit, danger-zone button | default (`h-8`) |
| toolbar control, faceted filter, Reset | `size="sm"` |
| row action, `⋯` trigger | `size="icon-sm"`, `variant="ghost"` |

A form's submit and each danger-zone button take `equalAction` (`min-w-48 justify-center`) so a
column of them reads as one set; everything else is content-sized. Both constants are in
[house-components.md](house-components.md#lib-constants).

## Icons on buttons

| Action | Icon (`@lucide/vue`) |
|---|---|
| create | `PlusIcon` |
| save | `SaveIcon` |
| edit | `PencilIcon` |
| view | `EyeIcon` |
| delete | `Trash2Icon` |
| refresh, sync | `RefreshCwIcon` |
| pause · resume | `PauseIcon` · `PlayIcon` |
| more | `EllipsisVerticalIcon` |
| expand · collapse | `ChevronsUpDownIcon` · `ChevronsDownUpIcon` |

- **No size class on an icon inside a `Button` or `Badge`.** The component sizes it per button size;
  a `size-4` you add freezes it at one size.
- **An icon-only button needs a name:** `:title` for the tooltip and an `sr-only` span (or
  `aria-label`) naming the action and the record ("Edit INV-0042").
- **Busy:** there is no `loading` prop. Swap the icon for `<Spinner />` and set `:disabled`; the label
  never changes to "Please wait". The other buttons of the same form are disabled too, without a
  spinner.

```vue
<Button type="submit" :class="equalAction" :disabled="form.processing">
    <Spinner v-if="form.processing" />
    <SaveIcon v-else />
    {{ t('common.save') }}
</Button>
```

## A link that looks like a button

Navigation is `<Link>`, so take the look from `buttonVariants()` rather than wrapping a `Button` in a
link:

```vue
<Link :href="invoices.create().url" :class="buttonVariants()"><PlusIcon />{{ t('invoices.new') }}</Link>
```

## Three actions, then `⋯`

| Where | Shows | Behind `⋯` |
|---|---|---|
| a table row | view · edit · delete, ghost `icon-sm`, in that order | everything else: duplicate, export, resend, a state change |
| a list's page header | one create | nothing else belongs in a list header |
| a record's page header | one primary action | every other action, delete last |

- Three is what a reader takes in per row at a glance; a fourth inline icon is where a menu starts.
  The `⋯` also keeps the column the same width on every row, which keeps a long table scannable.
- An action that does not apply is absent (no show page, no eye), and the survivors keep their order.
- Delete in a row is `Trash2Icon` with `text-destructive hover:text-destructive`, always inside
  `ConfirmAction`. In a `⋯` menu it is the last item, `variant="destructive"`.
- A `DropdownMenuContent` opened from an icon button gets a width (`w-40` or `w-max`); by default it
  copies the trigger's width.

## Absent, not disabled

A control the viewer may not use is not rendered (`v-if="can(...)"`, or `null` passed to
`RowActions`). A disabled control is a promise the page cannot keep. The one exception is a verb
refused for a reason about **this row** (deleting your own account): keep it disabled, with the reason
in its `title`, because its absence would read as a page that forgot it.

## Delete

1. **Where:** the third icon in a row, or the last item of a record's `⋯`, or a `DangerZone` below a
   record's sections.
2. **A confirm dialog** (`ConfirmAction`) whose title names the record, whose description says in
   one sentence what goes with it and what survives, and whose confirm button is solid destructive.
3. **The same permission the server enforces.** The dialog is the deliberate-intent gate; the route
   is the security boundary.
4. **Typed confirmation** (type the record's name) when the delete takes other records with it. A
   dialog that Enter dismisses is not a guard.
5. **Evidence is not deletable** (payments, audit entries). The screen says why instead of showing a
   disabled button.
6. **Afterwards:** redirect to the index and flash a toast naming what went.

## Dialogs

| Use | When |
|---|---|
| `Dialog` | content, or a short form of one decision; dismissible |
| `AlertDialog` (through `ConfirmAction`) | destructive or high-stakes actions; traps focus, needs a deliberate choice |
| `Sheet` | a side panel for a longer secondary form that keeps the list in view |

- A dialog's footer is an outline Cancel, then the action at the inline end.
- The confirm button says the verb ("Delete", "Send"), never "Yes" or "OK". It is red only when the
  action deletes; any other confirmation is the primary button.
- Word the title as a question about the concrete effect ("Send invoice INV-0042 to the customer?"),
  never "Are you sure?".
- Disable the confirm while the request runs, so it cannot fire twice.
- Every `Dialog`, `Sheet` and `Drawer` has a title (`sr-only` if it should not show). A sheet with no
  description binds `:aria-describedby="undefined"` on its content, or Reka warns on every open.

## Toasts

The listener is in [blueprint.md](blueprint.md#libflashts-the-toast-listener). The rules:

- **Toasts come only from it.** A page never calls `toast()` for a request's result; the controller
  flashes `success` or `error`. A toast then appears only because the server confirmed the outcome.
- **A GET stays silent; every write reports**, with the flashed message or a generic "Done".
- **Failures come from router events**: a validation failure says the save failed (the fields hold
  the detail), an HTTP or network error says the operation failed.
- **One clause.** The reason is on the screen behind the toast.
- **Never** a toast to confirm a destructive action, to carry something the user must act on, or to
  show a field error.
- The `Toaster` sits in each layout: `position="top-center"`, `close-button`, `:dir` and `:theme` from
  the page, so it follows the language and the appearance. Its font override is in the stylesheet
  ([theme.md](theme.md#unlayered-overrides)).

## Alerts by meaning

| Meaning | Use |
|---|---|
| the result of an action | a toast, never an inline box |
| a fact about the page, or something it did for the reader | `Alert` (default) |
| blocks saving or acting | `Alert variant="destructive"`, beside what it blocks |
| a sensitive section | `DangerZone` |

No warning that always shows: people learn to click past it, and it takes the real ones with it.

## Status badges

```vue
<StatusBadge :tone="invoice.status.tone" :label="invoice.status.label" />
```

- **The server chooses the tone.** The PHP enum has `tone()` and `label()`; the page never maps a
  status to a colour. A status that changes meaning then changes in one place.
- **Five tones, named by meaning:**

| Tone | Means | Examples |
|---|---|---|
| `ok` | finished, healthy, in force: needs nobody | Paid, Active, Closed |
| `warn` | waiting on somebody | Pending, Overdue |
| `danger` | refused, stopped, broken | Declined, Failed, Cancelled |
| `info` | a neutral fact, possibly not the end | Draft, Sent |
| `idle` | switched off, never a workflow state | Archived |

- **"Closed" and "Paid" are `ok`, not grey.** To someone working a queue they mean "needs nobody";
  a grey pill reads as "nothing happened".
- **The word is always shown.** Colour is the glance and the label is the answer; colour alone never
  carries a status.
- **An exceptional path** (an override, a bypass) gets a treatment of its own (`danger` plus an icon),
  never the normal `ok`.
- `lib/tone.ts` maps tone to classes (tinted fill, tone-coloured text); the tokens are in
  `assets/app.css`. A badge that is not a status uses `Badge` variants directly (`secondary` is the
  usual).

## Self-check

- [ ] One primary per screen; list header has at most a create.
- [ ] Row: view · edit · delete, then `⋯`; record header: one action, then `⋯`.
- [ ] Absent, not disabled; every action behind the server's own permission.
- [ ] Icons on every action button; spinner while busy; icon-only buttons named.
- [ ] Deletes named in a confirm; evidence not deletable; redirect and toast after.
- [ ] No `toast()` in a page; status tone from the server.
