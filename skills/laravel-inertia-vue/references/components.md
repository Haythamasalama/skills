# Components

**Read when:** choosing what to build a piece of UI out of, adding a shadcn-vue component, or
writing layout classes.
**Owns:** the registry primitive for each need, the composition rules the registry expects, layout
class rules, and how to keep the vendored `components/ui/` healthy.

## TL;DR

- Check the registry before you style a `div`. A hand-built version misses the focus ring, dark mode,
  RTL and keyboard behaviour.
- `components/ui/` is written by the shadcn-vue CLI only. Customise by wrapping in `components/`,
  passing `class`, or changing a token.
- The house wrappers (`PageHeader`, `DataTable`, `RowActions`, …) are in
  [house-components.md](house-components.md); use them before composing primitives yourself.
- `gap-*` on flex and grid, never `space-*`. `cn()` for conditional classes.

## What to use

| Need | Use |
|---|---|
| an action | `Button`, or `buttonVariants()` on an Inertia `<Link>` |
| a form | `FieldGroup` > `Field` > `FieldLabel` / control / `FieldError` (through `FormField`) |
| an input with an icon, affix or inner button | `InputGroup` + `InputGroupAddon` + `InputGroupInput` |
| one read-only field of a record | `DetailCard` in a grid, never a `Table` row |
| a timestamp | `DateTimeValue` |
| 2–7 exclusive choices | `ToggleGroup`, not Buttons with manual state |
| related checkboxes or radios | `FieldSet` + `FieldLegend` |
| a panel | `Card` with `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` |
| a callout | `Alert` |
| an empty section | `EmptyState`; an empty table row is `TableEmpty` |
| a chip | `Badge`; a status is `StatusBadge` |
| a loading placeholder | `Skeleton` |
| a rule | `Separator`, never `<hr>` or a bordered div |
| a progress bar | `Progress` |
| a modal · a side panel · a confirmation | `Dialog` · `Sheet` · `AlertDialog` (through `ConfirmAction`) |
| a menu | `DropdownMenu`, items inside a `DropdownMenuGroup` |
| a searchable list or picker | `Command`, in a `Popover` or `Dialog` |
| progressive disclosure | `Accordion` (many rows) or `Collapsible` (one) |
| a tooltip | `Tooltip` (needs one `TooltipProvider` in the layout) |
| a chart | `ChartContainer` + Unovis (shadcn-vue's `chart`) |

Don't hand-roll a styled `<button>`, a chip `<span>`, a native `<select>`, a div-with-a-width
progress bar or a lone `<hr>`.

## Composition rules the registry expects

- **Items live in their group:** `SelectItem` → `SelectGroup`, `DropdownMenuItem` →
  `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- **`TabsTrigger` lives in `TabsList`**, never directly in `Tabs`.
- **Every `Dialog`, `Sheet` and `Drawer` has a title** (`class="sr-only"` if it should not show).
- **`Avatar` always has `AvatarFallback`.**
- **Use the whole `Card`:** title and description in `CardHeader`, actions in `CardFooter`, not
  everything in `CardContent`.
- **No manual `z-index` on an overlay.** They manage their own stacking.
- **Reka's `SelectItem` rejects an empty value.** A "no filter" option uses the `ALL` sentinel
  ([lists.md](lists.md#filters)).
- **A `Select` whose trigger draws its own content** (instead of `SelectValue`) sets
  `position="popper"` on its content, or the list can open off-screen.

## Layout classes

- **`gap-*` on a flex or grid**, never `space-x-*` / `space-y-*`. One rhythm, set on the container.
- **The spacing scale:** `gap-4` between sections and cards, `gap-2` inside a group of buttons or a
  toolbar, `gap-1` between row-action icons, `gap-6` inside an auth card.
- **`size-*` when width and height match:** `size-8`, not `w-8 h-8`.
- **`truncate`**, not the three-property longhand. A record's value is never truncated.
- **`class` is for layout**: width, margin, grid placement. Colours and type come from variants and
  tokens.
- **`cn()` for conditional classes**, never a template-literal ternary. A component with visual
  variants declares them with `cva`, so the variant map is the one place a look is decided.
- **Field grids:** `grid gap-4 sm:grid-cols-2` in a form, `grid auto-rows-min gap-4 sm:grid-cols-2
  lg:grid-cols-3` for record facts.

## Keeping `components/ui/` healthy

- **Never hand-edit a file under `components/ui/`.** The CLI writes it, and re-adding a component
  replaces your edit while reporting only "Updated 1 file". Change a look through a token, a `class`
  at the call site, a constant in `lib/` (as `solidDestructive`), or a wrapper.
- **Hardcoded English inside a registry component** is overridden at the call site (a slot, an
  `aria-label`), never in the file.
- **Every `npx shadcn-vue@latest add` can rewrite the stylesheet.** Read `git diff` on it after each
  one ([theme.md](theme.md#changing-a-token)).
- **Use `npx shadcn-vue@latest diff`** to see what upstream changed before re-adding anything; it
  should be clean for files you did not mean to touch.
- **Don't import `reka-ui` directly in your own code.** shadcn-vue is built on it and its generated
  files import it, which is why it stays in `dependencies`. Reach for the shadcn-vue component. The
  exception is `ConfigProvider` at the root of each layout ([rtl-and-bidi.md](rtl-and-bidi.md)).
- **One icon package.** If a community registry component arrives importing another icon set, swap
  its icons before committing.
