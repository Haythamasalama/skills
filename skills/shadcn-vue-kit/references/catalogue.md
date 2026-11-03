# Catalogue

**Read when:** deciding what to build a piece of UI out of, or laying components out on a screen.
**Owns:** the registry component for each need, the layout class rules, and the wrappers worth
building once.

## TL;DR

- Check the registry before styling a `div`. A hand-built version misses the focus ring, dark mode,
  RTL and keyboard handling.
- Not installed yet? `npx shadcn-vue@latest docs <name>` prints the docs and example URLs; read them
  before using the component, then `add` it.
- `class` is for layout. Colour and type come from variants and tokens.

## Need → component

Don't hand-roll a styled `<button>`, a chip `<span>`, a native `<select>`, a div-with-a-width
progress bar or a lone `<hr>`: the component below exists.

| Need | Use |
|---|---|
| an action | `Button` with a variant; on a router link, `buttonVariants()` |
| a form | `FieldGroup` > `Field` > `FieldLabel` / control / `FieldDescription` / `FieldError` |
| an input with a prefix, suffix, icon or inner button | `InputGroup` + `InputGroupAddon` + `InputGroupInput` |
| 2–7 exclusive choices | `ToggleGroup`, not Buttons with manual active state |
| related checkboxes or radios | `FieldSet` + `FieldLegend` |
| on or off | `Switch` |
| one value from a short fixed list | `Select`; `NativeSelect` when the native picker on phones matters more than styling |
| one value found by typing | `Combobox`, or `Command` in a `Popover` |
| a one-time code | `InputOTP` |
| a date | `Calendar` in a `Popover` |
| a panel | `Card` with `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` |
| a list of records | `Table` (wrapped once as a data table) |
| one record's read-only fields | a grid of small cards or a description list, never a two-column `Table` |
| a row of list content with media and actions | `Item` |
| a callout | `Alert` |
| an empty state | `Empty` |
| a chip or status | `Badge` |
| a loading placeholder | `Skeleton` shaped like what replaces it |
| busy inside a button or a small count | `Spinner` |
| a rule | `Separator`, never `<hr>` or a bordered div |
| a progress bar | `Progress` |
| a modal · side panel · bottom sheet · confirmation | `Dialog` · `Sheet` · `Drawer` · `AlertDialog` |
| a menu | `DropdownMenu`; `ContextMenu` on right-click; `Menubar` for an app menu bar |
| a searchable list or command palette | `Command`, in a `Dialog` for a palette |
| a hint on hover | `Tooltip`; richer preview `HoverCard`; clickable panel `Popover` |
| app navigation | `Sidebar`, `Breadcrumb`, `Tabs`, `Pagination`, `NavigationMenu` |
| progressive disclosure | `Accordion` (many rows) or `Collapsible` (one) |
| a scroll box with a styled bar | `ScrollArea` |
| attached buttons | `ButtonGroup` |
| a toast | `toast()` from `vue-sonner`, with one `<Toaster />` in the root layout |
| a chart | `ChartContainer` + Unovis ([charts.md](charts.md)) |

A toast reports the result of an action. A field error belongs next to the field, never in a toast.

## Layout

- **`gap-*` on a flex or grid.** Never `space-x-*` / `space-y-*`; a vertical stack is
  `flex flex-col gap-*`. Why: `space-*` uses margins that break with wrapping, hidden children and RTL.
- **`size-*` when width and height match:** `size-8`, not `w-8 h-8`.
- **`truncate`**, not the three-property longhand. A record's own value (a URL, an address) wraps
  instead, because a cut value cannot be read.
- **`class` is for layout:** width, margin, grid placement. Not for a component's colours or type;
  that is what variants and tokens are for.
- **`cn()` for conditional classes**, not a template-literal ternary. Why: `cn()` resolves Tailwind
  conflicts, so the later class wins.
- **Logical sides only**; the list of classes is in [rtl.md](rtl.md).
- **`tabular-nums`** on numbers in a table or a column, so digits line up.

## Wrappers worth building

Optional. Build one only when two screens need the same thing; one screen composes the primitives
inline. How to write one without touching `components/ui/` is in
[vendored-folder.md](vendored-folder.md).

| Wrapper | Over | Why |
|---|---|---|
| `PageHeader` | — | one shape for every page: title or breadcrumb, an optional status, the actions |
| `DataTable` | `Table` + `Pagination` + `Empty` | the card, the empty row, the pagination footer |
| `FacetedFilter` | `Popover` + `Command` | a toolbar filter with its selection badges |
| `RowActions` | `DropdownMenu` | the `⋯` menu at the end of a row |
| `ConfirmAction` | `AlertDialog` | nothing irreversible runs without a question |
| `FormField` | `Field` | label + control + error, with `data-invalid` wired |
| `StatusBadge` | `Badge` | a status coloured by a tone the server sends |
| `ComboBox` | `Popover` + `Command` | a searchable select |
| `PhoneField` | `InputGroup` + `Command` | country code and number read as one left-to-right value |

A confirmation's button names the action (Delete, Publish), never Yes, and is red only when the
action destroys something. Why: the reader decides from the button, and red loses meaning if every
confirm uses it.
