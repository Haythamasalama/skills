# UI screens: lists, records, forms and feedback

**Read when:** building or reviewing a list, a detail page, a form, a delete, a toast or a confirm dialog,
or choosing colours, components and on-screen wording, in a component-library front end (shadcn-vue
style, Tailwind tokens). Most rules also hold for Blade pages.
**Owns:** where each verb goes, list and table shape, status chips, confirmations, toasts, theming,
wrapping vendored components, UI copy.
**See also:** [inertia-pages.md](inertia-pages.md) · [forms.md](forms.md) · [buttons.md](buttons.md)

## TL;DR

- **A verb goes where the reader is when they decide to use it.** Lists open rows; records carry the verbs;
  verbs that end a record sit at its foot.
- An action the viewer may not use is **absent**, not disabled.
- Status is always a coloured chip from one status → tone map per domain.
- Lists are server-paginated and server-filtered; never filter or sort a page of rows in the browser.
- Destructive or high-stakes actions go through a confirm dialog that names the thing.
- Toasts come from the server's flash only; they report outcomes, never ask for decisions.
- Semantic colour tokens only, checked in light **and** dark. Never edit vendored primitives; wrap them.
- Copy is short and plain: one help line per field, a refusal names the next action.

## Index pages

```
Header   title ─────────────────────────── [ New invoice ]
Panel
  toolbar   search · filter · filter · [Clear]
  table     rows …                              [view] [edit] [delete] [⋯]
  footer    pagination
```

- **The header carries at most one verb, and it is a create.** A header full of buttons applies to no row.
- **Row actions:** last cell, right-aligned, three icon buttons in this order — View, Edit, Delete — then a
  `⋯` menu for anything else (resend, export, a state change). Each icon only when it applies and the
  viewer may use it.
- The first cell is a link to the same place View goes. It is the one people click, and it keeps the list
  keyboard-navigable in reading order.
- Status in its own column as a chip, on the index and beside the title on the show page.
- **Empty state:** an icon, a title, and one sentence naming the next action ("Try another search, or
  clear the filters."). Never a bare "No results".
- Numeric columns right-aligned.

### Tables

- Data, page and filter state arrive as props; the table renders that page and reports intent by
  re-visiting the URL. Why: a client-side filter searches one page and claims the rest did not match, and
  it sidesteps the server's access scoping.
- No client-side sort; a sortable column sorts on the server through the filter DTO and scope.
- A select's "no filter" value is a sentinel (`'__all__'`), not an empty string; the Clear button shows
  only when a filter differs from its default.
- Stable `:key` on every row. Plain table primitives and `v-for` are enough for a paginated, server-filtered
  list; add a headless table library only for a need the server cannot serve.

## Show pages

```
← back
Header   title [status chip] ──────────── [ Primary ] [ ⋯ ]
main     the record itself
         notes / comment box + the deciding verbs        ← at the foot
aside    fact cards: what it is · who it belongs to · its outcome
```

- **Chips go in the title's meta slot, never in the actions slot.** A status is not something you press.
- **At most two header actions plus `⋯`**: things the record waits for that do not end it (Edit, Reply).
  Delete goes last in the `⋯`, styled destructive.
- **Verbs that end a record** (approve, decline, close) sit at the foot of the main column beside the note
  box, so what was typed becomes the reason. Negative verb: outline button with a red icon. Positive:
  solid. Never a red slab for a rejection; destructive styling is for deletes.
- The aside is facts, not actions: label left (muted, small), value right, links to related records.
- **Offered states come from the server** (the reachable transitions), never a list hardcoded in the page.
- **Toggle or one-way door.** An edit, a note, a label can be reopened and corrected. A decision that moves
  something else (charges, switches a plan, sends mail) is one-way: check the live status inside the lock
  that performs the transition, and fix a wrong decision through the thing it changed, not by flipping it.

## Create and edit

- Edit is its own route when the form has more than three fields or the record has a URL worth sharing.
  A modal fits one field and one decision (rename, confirm, pick from a short list).
- The submit button says the verb alone ("Save", "Send"), never "Submit".
- Disable submit while processing, and on edit forms while nothing has changed.

## Delete

1. A row's third icon (red), or the last `⋯` item on a show page.
2. Behind a confirm dialog that names the record, says in one sentence what goes with it, and has a
   destructive confirm button.
3. Behind the same permission the server enforces (and a fresh password for internal-tool deletes, if the
   app has step-up auth).
4. **Typed confirmation** (type the name or handle) when the delete takes other records with it. A dialog
   that Enter dismisses is not a guard.
5. Records that are evidence (payments, audit entries) are not deletable at all; the screen says why
   instead of showing a disabled button.

After a delete: redirect to the index and flash a toast naming what went.

## Feedback

### Toasts follow the flash

Register one listener on the Inertia router at boot (see SKILL.md); `success` → success toast,
`error` → error toast. Do not fire an optimistic toast from a component: a toast appears only because the
server confirmed the outcome. Toasts are transient; never use one to confirm a destructive action or to
carry something the user must act on.

### Dialog or alert dialog

| Use | When |
|---|---|
| Dialog | content or a low-stakes form; dismissible |
| Alert dialog (Cancel / Confirm, traps focus) | **required** for destructive or high-stakes actions |

Word the confirm in terms of the concrete effect ("Send invoice INV-0042 to the customer?"), not
"Are you sure?". Disable the confirm button while the form is processing so it cannot fire twice. The
dialog is the deliberate-intent gate; the server still re-checks permission.

## Components

What to build each piece from, the house wrappers and the vendored folder: [components.md](components.md).

## Theming

Tokens, palette, fonts and dark mode: [theme.md](theme.md). What is specific to screens:

- Status tones are a fixed vocabulary (`ok`, `warn`, `danger`, `idle`, `info`), filled chips, one hue per
  meaning, and the icon plus the word tell statuses apart; colour alone never carries a status.
- "Finished" (paid, closed) reads as `ok`, not grey: to someone working a queue it means "needs nobody".
- An exceptional path (an override, a bypass) gets its own visibly distinct tone, never the normal success tone.
- Check every new surface in light and dark before calling it done.

## Page container

Open every page with one container class string, so padding, section gaps and side margins match across
the app. Use a column (`flex flex-col gap-6 p-6`), never `space-y-*` or per-section margins, and a small
set of widths chosen by purpose (wide for pages you read, narrow for pages you fill in, none for
full-bleed tables). A one-off width for one screen is how margins stop matching.

## Copy

Each surface has a reader: the product UI is read mid-task, guides explain what a screen means, legal pages
are filed, code comments are for the next engineer. Write for the one reading.

| Surface | Budget |
|---|---|
| Help under a field | one sentence, about 12 words |
| Confirm dialog | the consequence, and the way back if there is one |
| Empty state | one sentence naming the next action |
| Panel subtitle | none; the content says it |
| Toast | one clause |

- State the rule, not the reasoning; the reasoning belongs in a code comment beside the rule.
- Show rather than describe: a good placeholder or example often replaces the help line.
- A refusal names the next action, or who can take it.
- Use the words the screen uses; a guide never names an internal key the UI never shows.
- No warning that always shows; people learn to click past it and take the real ones with it.
- Nothing on a screen describes the screen it is printed on.
- No em dashes, semicolons, "simply" or "please note" in UI text. Two thoughts are two sentences.

## Self-check

- [ ] Index header has at most one verb, a create.
- [ ] Row actions: View, Edit, Delete icons in that order, last cell; the rest behind `⋯`.
- [ ] A verb the viewer may not use is absent.
- [ ] Status chip on index and show, from one map per domain.
- [ ] Offered states come from the server.
- [ ] Delete: named confirm, server permission, typed confirm when it cascades, refused for evidence.
- [ ] Toasts only from flash; destructive actions behind an alert dialog.
- [ ] Tokens only, checked in light and dark; no edits under `components/ui/`.
