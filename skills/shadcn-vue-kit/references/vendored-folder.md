# The vendored folder

**Read when:** running `add`, `apply` or `migrate`, updating a component from upstream, changing
how a registry component looks or behaves, importing from `reka-ui`, or picking icons.
**Owns:** what the CLI overwrites, the update workflow, customising through wrappers (with code),
the reka-ui import rule, the icon package, community registry items.

## TL;DR

- `components/ui/` is CLI output. Never hand-edit it; customise one layer up, in `components/`.
- `add` can rewrite the stylesheet. Read `git diff` after every CLI run and put back what it dropped.
- Re-adding an installed component, `--overwrite` and `apply` replace your files. Ask first.
- Import the shadcn-vue component, not `reka-ui`, except for `ConfigProvider`, types, and a
  primitive the registry does not wrap.
- One icon package, the one in `components.json`.

## Two folders, one rule each

| Folder | Holds | Rule |
|---|---|---|
| `components/ui/` | registry components, written by the CLI | never hand-edit |
| `components/` | your wrappers and compositions | every project decision lives here |

Why: an edit in `components/ui/` has no record of what is yours and what is upstream, and one "yes"
to the overwrite question (or one `--overwrite`) reverts it. If a component seems to need a project-wide change,
it is almost always a token ([theme.md](theme.md)) or a wrapper.

## What the CLI writes

| Command | Writes |
|---|---|
| `add <name>` | the component folder, the registry components it depends on (adding `sidebar` also brings `sheet`, `tooltip` and others), npm packages, and CSS variables or font imports into the stylesheet |
| `add <installed name>` | the same files again. For each file that differs it asks "already exists. Would you like to overwrite?" (default no); `--overwrite` skips the question. A dependency you edited gets the same question, so read each one before answering |
| `add --overwrite`, `add --all -o` | replaces every existing file it touches |
| `apply <preset>` | overwrites config, fonts, CSS variables and every detected component |
| `init --preset <p> --force --no-reinstall` | config and CSS only; leaves components as they are |
| `migrate rtl [path]` | rewrites physical classes in `components/ui/` and sets `"rtl": true` |
| `migrate icons` | swaps the icon library in your components |

Seen on the stylesheet with 2.8.x (checked 2026-11-03): `add` re-syncs the Google Fonts `@import`
lines to its own font set, dropping one it does not know (an Arabic face), and can append a second
`@layer base`. After every CLI run:

```bash
git diff -- components.json resources/css/app.css   # your stylesheet path
git diff --stat -- resources/js/components/ui        # only what you meant to add
```

## Updating a component from upstream

In 2.8.2 `add --dry-run`, `--diff` and `--view` exist in `--help` but print "not yet supported", and
the `diff` command is not on the docs page (checked 2026-11-03). Use git as the diff tool:

1. Commit or stash, so the tree is clean.
2. `npx shadcn-vue@latest add <name> --overwrite` (with the user's yes).
3. `git diff -- resources/js/components/ui/<name>`: upstream changes against your copy.
4. Keep the upstream hunks, revert anything that undoes a deliberate change, re-run the type check.

Switching a preset: ask whether to overwrite (`apply`), merge (`init --preset … --force
--no-reinstall`, then update each component as above) or skip (the same `init`, nothing else).

## Customising without editing: three patterns

**1. A class constant**, for one recurring treatment the variants lack. It stays a `class`, so the
vendored button keeps its source and survives the next `add`.

```ts
// lib/button.ts
export const solidDestructive =
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90';
```

```vue
<Button variant="destructive" :class="solidDestructive">Delete</Button>
```

The `dark:` halves are not redundant: if the variant sets `dark:bg-destructive/20`, tailwind-merge
treats a prefixed class as a different key, so an unprefixed `bg-destructive` never replaces it.

**2. A wrapper that maps meaning to look**, so no screen decides it again. Variants through `cva`,
colours through tokens:

```vue
<!-- components/StatusBadge.vue -->
<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';

const statusBadge = cva('border-transparent', {
    variants: {
        tone: {
            green: 'bg-tone-green/12 text-tone-green',
            blue: 'bg-tone-blue/12 text-tone-blue',
            orange: 'bg-tone-orange/12 text-tone-orange',
            error: 'bg-destructive/12 text-destructive',
            gray: 'bg-muted text-muted-foreground',
        },
    },
    defaultVariants: { tone: 'gray' },
});

export type StatusTone = NonNullable<VariantProps<typeof statusBadge>['tone']>;

defineProps<{ tone?: StatusTone; label: string }>();
</script>

<template>
    <Badge variant="outline" :class="statusBadge({ tone })">{{ label }}</Badge>
</template>
```

Let the server send the tone (or a status the client maps once), never a colour.

**3. A composition wrapper**, for markup every form repeats:

```vue
<!-- components/FormField.vue -->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

const props = defineProps<{
    label: string;
    for?: string;
    description?: string;
    error?: string;
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <Field :data-invalid="!!error || undefined" :class="cn('content-start', props.class)">
        <FieldLabel :for="props.for">{{ label }}</FieldLabel>
        <slot />
        <FieldDescription v-if="description">{{ description }}</FieldDescription>
        <FieldError v-if="error" :errors="[error]" />
    </Field>
</template>
```

Wrappers take `class` and merge it with `cn()` last, so a caller can still place them.

A hardcoded English string inside a registry component is overridden at the call site (a slot, a
prop, `aria-label`), never by editing the file.

## The reka-ui import rule

shadcn-vue is built on Reka UI; its generated files import `reka-ui`, which is why the package stays
in `dependencies`. In your own code:

- Import the shadcn-vue component (`@/components/ui/dialog`), not the Reka primitive. Why: the
  styling, slots and data attributes live in the wrapper, and a raw primitive looks unstyled.
- Allowed: `ConfigProvider` in the root layouts (direction and locale, see [rtl.md](rtl.md)),
  type-only imports (`import type { DateValue } from 'reka-ui'`), and a primitive the registry does
  not wrap, used inside a wrapper in `components/`, never on a page.
- Rebuilding focus or keyboard handling that Reka already has is never the answer.

## Icons

- One package: the one `iconLibrary` names. `lucide` → `@lucide/vue`, `tabler` → `@tabler/icons-vue`,
  `phosphor` → `@phosphor-icons/vue`, `remixicon` → `@remixicon/vue`, `hugeicons` → `@hugeicons/vue`.
  `lucide-vue-next` is the legacy Lucide package; new code imports `@lucide/vue` (checked 2026-11-03).
- Named imports only (`import { PencilIcon } from '@lucide/vue'`), so the bundle keeps only those.
- Colour an icon with a token (`text-muted-foreground`); never a hex.
- Pass an icon to a component as the component itself (`:icon="PencilIcon"`), not a string key.
- Inside a `Button` or a registry component, no size class; elsewhere size with `size-*`.
- The same concept takes the same icon on every screen.

## Community registries

- Name the registry explicitly (`@namespace/item`); never guess one for the user.
- After adding from one, read every added file: fix imports that assume `@/components/ui` when your
  alias differs, swap icons from another package, and check the composition rules in `SKILL.md`.
