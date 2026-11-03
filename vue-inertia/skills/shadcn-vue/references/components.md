# Components

What to build a piece of UI out of: the registry primitive for each need, the house wrappers to
build once, layout rules, and how to keep the vendored registry healthy.

## The rule

**Check the registry before you style a `div`.** Almost everything exists. A hand-built version
misses the focus ring, dark mode, RTL and keyboard behaviour. Don't hand-roll a styled `<button>`,
a chip `<span>`, a native `<select>`, a div-with-a-width progress bar or a lone `<hr>`: `Button`,
`Badge`, `Select`, `Progress` and `Separator` exist.

| Need | Use |
|---|---|
| an action | `Button`, or `buttonVariants()` on a router link (Inertia `<Link>`, `<RouterLink>`, `<NuxtLink>`) |
| a form | `FieldGroup` > `Field` > `FieldLabel` / control / `FieldError` |
| an input with an affix, icon or inner button | `InputGroup` + `InputGroupAddon` + `InputGroupInput` |
| one read-only field of a record | a detail card in a grid, never a `Table` row |
| a timestamp | a date-time component: the date, the time under it |
| a phone number | a phone field: country picker + number |
| 2–7 exclusive choices | `ToggleGroup`, not Buttons with manual state |
| related checkboxes or radios | `FieldSet` + `FieldLegend` |
| a panel | `Card` with `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` |
| a callout | `Alert` |
| an empty state | `Empty` |
| a chip | `Badge` |
| a loading placeholder | `Skeleton` |
| a rule | `Separator`, never `<hr>` or a bordered div |
| a progress bar | `Progress` |
| a modal · side panel · confirmation | `Dialog` · `Sheet` · `AlertDialog` |
| a menu | `DropdownMenu`, items inside a `DropdownMenuGroup` |
| a searchable list | `Command`, in a `Dialog` or `Popover` when it is a picker |
| progressive disclosure | `Accordion` (many rows) or `Collapsible` (one) |
| a toast | `toast()` from vue-sonner |
| a chart | `ChartContainer` + Unovis (see `charts.md`) |

## Composition rules the registry expects

- **Items live in their group:** `SelectItem` → `SelectGroup`, `DropdownMenuItem` →
  `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- **`TabsTrigger` lives in `TabsList`**, never directly in `Tabs`.
- **Every `Dialog`, `Sheet` and `Drawer` has a Title** for accessibility (`class="sr-only"` if it
  should not show), and a Description too, or Reka warns.
- **`Avatar` always has `AvatarFallback`.**
- **Use the whole Card:** title and description in `CardHeader`, actions in `CardFooter`.
- **No manual `z-index`** on an overlay. They manage their own stacking.
- **Reka's `SelectItem` rejects an empty value.** Use a sentinel (`'any'`) and map it back to `''`.

## House wrappers

Thin components over the registry in `components/`, built once so every screen looks the same.
A new wrapper belongs here only when two screens need it; one screen composes the primitives
inline.

| Wrapper | Wraps | Why |
|---|---|---|
| `PageHeader` | — | one shape for every page: title, status slot, actions (teleported into the shell header) |
| `DataTable` | `Table` + `Pagination` | the card, the empty row, the pagination footer |
| `DataTableFacetedFilter` | `Popover` + `Command` | the dashed toolbar filter with its selection badges |
| `RowActions` | `DropdownMenu` | the `⋯` at the end of a row or header |
| `ConfirmAction` | `AlertDialog` | nothing irreversible happens without it |
| `DangerZone` | `Card` | a sensitive section: red eyebrow, what happens, button on a tinted footer |
| `FormField` | `Field` | label + control + error, with `data-invalid` wired |
| `DetailCard` | `Card` | one read-only field: icon + muted label, value below |
| `DateTimeValue` | — | a timestamp over two lines |
| `PhoneNumberField` | `InputGroup` + `Popover` + `Command` | country picker (flag, dial code, search) + number |
| `LocaleTabs` | `Tabs` | one pane per language for a translatable field |
| `StatusBadge` | `Badge` | a status coloured by the server's tone |
| `ComboBox` | `Popover` + `Command` | a searchable select |

## Layout

- **`gap-*` on a flex or grid.** Never `space-x-*` / `space-y-*`.
- **`size-*` when width and height match:** `size-8`, not `w-8 h-8`.
- **`truncate`**, not the three-property longhand. (But a record's value, like a URL on a detail card, should wrap, not truncate.)
- **`class` is for layout:** width, margin, grid placement. Not for restyling a component's
  colours or type; that is what variants and tokens are for.
- **`cn()` for conditional classes**, not a template-literal ternary.

## Keeping the vendored registry healthy

- **`shadcn-vue add` rewrites the main stylesheet.** Every install can re-emit the font import
  (dropping an Arabic face from the stack) and append its own `@layer base`, duplicating the base
  rules. Read `git diff` on the stylesheet after any `add` and put back what it dropped.
- **Re-running `add` for an installed component silently reverts your edits to it.** The CLI
  reports only "Updated 1 file". If you extended a generated `cva` config in place (an extra
  `Button` or `Badge` variant), check `git diff` after every `add`. Prefer a class constant in
  `lib/` (for example a `solidDestructive` string) over editing the vendored file.
- **Don't import `reka-ui` directly in hand-written code.** shadcn-vue is built on it and its
  generated files import it at runtime, which is why the package stays in `dependencies`. Reach
  for the shadcn-vue component instead. The exception is `ConfigProvider` in the root layout
  (see `rtl.md`). An architecture test that fails the build on a direct import keeps
  this true.
- **One icon package.** If a community-registry component arrives importing another icon set,
  swap it before committing.
- **Colour-encoded variants are allowed when the tint is the content.** A badge whose colour tells
  the reader what kind of item it is (question, problem, empathy) is the documented exception to
  "no raw colours". Define those variants once, not per page.
