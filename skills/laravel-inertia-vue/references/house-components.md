# House components

**Read when:** creating one of the shared components, or checking a prop or a slot before using
one.
**Owns:** the props, slots and template of each house component, and the small `lib/` constants they
rely on.

## TL;DR

- Build these once in `components/`; every screen uses them, which is what keeps screens identical.
  The composables they call are in [composables.md](composables.md).
- Each is a thin wrapper over shadcn-vue parts. The classes below are the look; change them here,
  never per page.
- A new house component earns its place when a second screen needs it. One screen composes the
  primitives inline.
- `t()` is the translation helper from [composables.md](composables.md#usetranslations); a
  one-language app passes plain strings.

## Catalogue

| Component | Props | Slots | Wraps |
|---|---|---|---|
| `PageHeader` | `title`, `description?` | `actions`, `description` | teleport to the shell header |
| `DataTable` | `paginator`, `colspan` | `toolbar`, `head`, `rows`, `empty` | `Card` + `Table` + `Pagination` |
| `DataTableFacetedFilter` | `title`, `options`, `v-model` | | `Popover` + `Command` |
| `RowActions` | `view?`, `edit?`, `destroy?`, `label` | default (the `⋯` items) | `Button`, `DropdownMenu`, `ConfirmAction` |
| `ConfirmAction` | `href`, `method?`, `title`, `description?`, `confirmLabel`, `destructive?`, `data?`, `only?` | default (the trigger) | `AlertDialog` |
| `FormField` | `label`, `for?`, `hint?`, `description?`, `error?` | default (the control) | `Field` |
| `DetailCard` | `label`, `icon` | default (the value) | `Card` |
| `DateTimeValue` | `value` | | |
| `StatusBadge` | `tone`, `label` | | `Badge` |
| `EmptyState` | `icon?`, `title`, `description?` | default (the way out) | |
| `DangerZone` | `title`, `description?` | default (the button) | `Card` |

## `lib/` constants

```ts
// lib/button.ts
export const solidDestructive =
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90';
export const equalAction = 'min-w-48 justify-center';

// lib/tone.ts
export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'idle';

const tones: Record<Tone, string> = {
    ok: 'border-transparent bg-success/12 text-success',
    warn: 'border-transparent bg-warning/12 text-warning',
    danger: 'border-transparent bg-destructive/12 text-destructive',
    info: 'border-transparent bg-info/12 text-info',
    idle: 'border-transparent bg-muted text-muted-foreground',
};

export const toneClass = (tone: Tone): string => tones[tone] ?? tones.idle;

// lib/direction.ts
export const autoDir = (value: unknown): 'auto' | undefined =>
    typeof value === 'string' && value.trim() !== '' ? 'auto' : undefined;
```

- `solidDestructive`: some registry styles ship `destructive` as a tint, right for a menu item and
  too quiet on the button that deletes. The `dark:` halves are needed because tailwind-merge treats a
  prefixed class as a different key.
- `equalAction`: a form's submit and each danger-zone button share one minimum width, so a column of
  them reads as a set. Toolbar controls, row actions and header links stay content-sized.
- The tone tokens (`--success`, `--warning`, `--info`) are in `assets/app.css`. Which tone a status
  takes is decided on the server ([actions-and-feedback.md](actions-and-feedback.md#status-badges)).

## `PageHeader`

```vue
<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
    <h1 class="sr-only">{{ title }}</h1>
    <Teleport v-if="$slots.actions" defer to="#page-actions">
        <slot name="actions" />
    </Teleport>
    <p v-if="description || $slots.description" class="max-w-prose text-sm text-muted-foreground">
        <slot name="description">{{ description }}</slot>
    </p>
</template>
```

The breadcrumb in the shell header already names the page, so the `h1` is for the accessibility tree
only. `defer` waits for `#page-actions` to exist. Every page uses it, together with `<Head :title>`.

## `DataTable`

```vue
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import type { Paginated } from '@/types';

const props = defineProps<{ paginator: Paginated<unknown>; colspan: number }>();
const edge = 'border bg-background hover:bg-accent hover:text-accent-foreground';

const perPage = computed({
    get: () => String(props.paginator.per_page),
    set: (value: string) => router.reload({ data: { per_page: value, page: 1 } }),
});

const go = (page: number) => page !== props.paginator.current_page && router.reload({ data: { page } });
</script>

<template>
    <div class="flex flex-col gap-4">
        <div v-if="$slots.toolbar" class="flex flex-wrap items-center gap-2">
            <slot name="toolbar" />
        </div>
        <Card class="py-0">
            <Table>
                <TableHeader class="bg-muted">
                    <TableRow class="hover:bg-transparent"><slot name="head" /></TableRow>
                </TableHeader>
                <TableBody>
                    <TableEmpty v-if="!paginator.data.length" :colspan="colspan"><slot name="empty" /></TableEmpty>
                    <slot v-else name="rows" />
                </TableBody>
            </Table>
        </Card>
        <div v-if="paginator.data.length" class="flex items-center justify-between px-2">
            <p class="flex-1 text-sm text-muted-foreground">
                {{ t('common.showing_range', { from: paginator.from ?? 0, to: paginator.to ?? 0, total: paginator.total }) }}
            </p>
            <div class="flex items-center gap-6 lg:gap-8">
                <div class="flex items-center gap-2">
                    <p class="hidden text-sm font-medium whitespace-nowrap sm:block">{{ t('common.rows_per_page') }}</p>
                    <Select v-model="perPage">
                        <SelectTrigger size="sm" class="h-8 w-[70px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="size in ['10', '20', '30', '50']" :key="size" :value="size">{{ size }}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <p class="text-sm font-medium whitespace-nowrap">
                    {{ t('common.page_of', { page: paginator.current_page, total: paginator.last_page }) }}
                </p>
                <Pagination :page="paginator.current_page" :items-per-page="paginator.per_page" :total="paginator.total"
                    :sibling-count="0" show-edges class="mx-0 w-auto" @update:page="go">
                    <PaginationContent class="gap-2">
                        <PaginationFirst class="hidden size-8 p-0 lg:flex" :class="edge"><ChevronsLeftIcon class="rtl:rotate-180" /></PaginationFirst>
                        <PaginationPrevious class="size-8 p-0!" :class="edge"><ChevronLeftIcon class="rtl:rotate-180" /></PaginationPrevious>
                        <PaginationNext class="size-8 p-0!" :class="edge"><ChevronRightIcon class="rtl:rotate-180" /></PaginationNext>
                        <PaginationLast class="hidden size-8 p-0 lg:flex" :class="edge"><ChevronsRightIcon class="rtl:rotate-180" /></PaginationLast>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    </div>
</template>
```

- shadcn's data-table footer: square outline arrows, no numbered pages. Each arrow also gets an
  `sr-only` label from the lang files.
- `router.reload({ data })` merges into the current query string, so the filters survive a page turn.
  The server reads `per_page` with an allow-list of sizes.

## `DataTableFacetedFilter`

```vue
<script setup lang="ts">
export type FacetOption = { value: string; label: string };
const props = defineProps<{ title: string; options: FacetOption[] }>();
const model = defineModel<string>({ default: '' });
const open = ref(false);
const selected = computed(() => props.options.find((option) => option.value === model.value));

function pick(value: string) {
    model.value = model.value === value ? '' : value;
    open.value = false;
}
</script>

<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button variant="outline" size="sm" class="border-dashed">
                <CirclePlusIcon />
                {{ title }}
                <template v-if="selected">
                    <Separator orientation="vertical" class="mx-0.5 data-[orientation=vertical]:h-4" />
                    <Badge variant="secondary" class="rounded-sm px-1 font-normal">{{ selected.label }}</Badge>
                </template>
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-52 p-0" align="start">
            <Command>
                <CommandInput :placeholder="title" />
                <CommandList>
                    <CommandEmpty>{{ t('common.no_results') }}</CommandEmpty>
                    <CommandGroup>
                        <CommandItem v-for="option in options" :key="option.value" :value="option.label" @select="pick(option.value)">
                            <div :class="cn('flex size-4 items-center justify-center rounded-sm border border-primary',
                                model === option.value ? 'bg-primary text-primary-foreground' : 'opacity-50')">
                                <CheckIcon v-if="model === option.value" class="size-3" />
                            </div>
                            <span class="truncate">{{ option.label }}</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>
```

It works on a string, so it needs no sentinel: `''` means "no filter" and never reaches a `SelectItem`.

## `RowActions`

```vue
<script setup lang="ts">
type Destroy = { href: string; title: string; description?: string };
const props = withDefaults(
    defineProps<{ view?: string | null; edit?: string | null; destroy?: Destroy | null; label: string }>(),
    { view: null, edit: null, destroy: null },
);
const ghost = buttonVariants({ variant: 'ghost', size: 'icon-sm' });
</script>

<template>
    <div class="flex items-center justify-end gap-1">
        <Link v-if="view" :href="view" :class="ghost" :title="t('common.view')">
            <EyeIcon /><span class="sr-only">{{ t('common.view') }} {{ label }}</span>
        </Link>
        <Link v-if="edit" :href="edit" :class="ghost" :title="t('common.edit')">
            <PencilIcon /><span class="sr-only">{{ t('common.edit') }} {{ label }}</span>
        </Link>
        <ConfirmAction v-if="destroy" :href="destroy.href" method="delete" :title="destroy.title"
            :description="destroy.description" :confirm-label="t('common.delete')">
            <Button variant="ghost" size="icon-sm" class="text-destructive hover:text-destructive" :title="t('common.delete')">
                <Trash2Icon /><span class="sr-only">{{ t('common.delete') }} {{ label }}</span>
            </Button>
        </ConfirmAction>
        <DropdownMenu v-if="$slots.default">
            <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon-sm" class="data-[state=open]:bg-muted">
                    <EllipsisVerticalIcon /><span class="sr-only">{{ t('common.more_actions') }} {{ label }}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuGroup><slot /></DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>
```

The page passes `null` for a verb the viewer may not use, so it is absent. Where the verbs go and
why is [actions-and-feedback.md](actions-and-feedback.md#three-actions-then-).

## `ConfirmAction`

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
    href: string;
    method?: 'post' | 'put' | 'patch' | 'delete';
    title: string;
    description?: string;
    confirmLabel: string;
    destructive?: boolean;
    data?: Record<string, string | number | boolean>;
    only?: string[];
}>(), { method: 'post', destructive: true });

const open = ref(false);

function confirm() {
    router.visit(props.href, {
        method: props.method,
        data: props.data ?? {},
        only: props.only,
        preserveScroll: true,
        preserveState: props.only !== undefined,
    });
    open.value = false;
}
</script>

<template>
    <AlertDialog v-model:open="open">
        <AlertDialogTrigger as-child><slot /></AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ title }}</AlertDialogTitle>
                <AlertDialogDescription v-if="description">{{ description }}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
                <AlertDialogAction :class="cn(destructive && [buttonVariants({ variant: 'destructive' }), solidDestructive])" @click="confirm">
                    {{ confirmLabel }}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
```

`destructive: false` gives a primary confirm, for a decision that deletes nothing (send, publish).

## `FormField`

```vue
<script setup lang="ts">
const props = defineProps<{ label: string; for?: string; hint?: string; description?: string; error?: string; class?: HTMLAttributes['class'] }>();
</script>

<template>
    <Field :data-invalid="!!error || undefined" :class="cn('content-start', props.class)">
        <FieldLabel :for="props.for">
            {{ label }}
            <span v-if="hint" class="font-normal text-muted-foreground">{{ hint }}</span>
        </FieldLabel>
        <slot />
        <FieldDescription v-if="description">{{ description }}</FieldDescription>
        <FieldError v-if="error" :errors="[error]" />
    </Field>
</template>
```

The control inside also takes `:aria-invalid="!!error || undefined"` ([forms.md](forms.md)).

## `DetailCard` and `DateTimeValue`

```vue
<!-- DetailCard.vue: defineProps<{ label: string; icon: Component }>() -->
<Card class="gap-2">
    <CardHeader>
        <CardDescription class="flex items-center gap-2 text-xs">
            <component :is="icon" class="size-3.5 shrink-0" />
            {{ label }}
        </CardDescription>
        <CardTitle class="text-sm font-medium break-all"><slot /></CardTitle>
    </CardHeader>
</Card>

<!-- DateTimeValue.vue: defineProps<{ value: string | null }>(); parts = value.split(' ') -->
<span v-if="parts[0]" dir="ltr" class="inline-flex flex-col leading-tight tabular-nums">
    <span>{{ parts[0] }}</span>
    <span v-if="parts[1]" class="text-xs text-muted-foreground">{{ parts[1] }}</span>
</span>
<span v-else class="text-muted-foreground">—</span>
```

`break-all`, never `truncate`: a URL or a code is the point of the card. The server sends
`Y-m-d H:i:s`; the time goes under the date so neither is read out of a run of digits.

## `StatusBadge`

```vue
<script setup lang="ts">
defineProps<{ tone: Tone; label: string }>();
</script>

<template>
    <Badge variant="outline" :class="toneClass(tone)">{{ label }}</Badge>
</template>
```

## `EmptyState` and `DangerZone`

```vue
<!-- EmptyState.vue: defineProps<{ icon?: Component; title: string; description?: string }>() -->
<div class="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
    <div v-if="icon" class="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <component :is="icon" class="size-5" />
    </div>
    <div class="flex flex-col gap-1">
        <p class="text-sm font-medium">{{ title }}</p>
        <p v-if="description" class="max-w-sm text-sm text-pretty text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
</div>

<!-- DangerZone.vue: defineProps<{ title: string; description?: string }>() -->
<Card class="ring-destructive/25">
    <CardHeader>
        <p class="flex items-center gap-1.5 text-xs font-medium tracking-wide text-destructive uppercase">
            <TriangleAlertIcon class="size-3.5" />
            {{ t('common.danger_zone') }}
        </p>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription v-if="description">{{ description }}</CardDescription>
    </CardHeader>
    <CardFooter class="justify-end gap-2 border-destructive/20 bg-destructive/5"><slot /></CardFooter>
</Card>
```

The colour sits on the eyebrow and the footer strip, not the whole card, so the description reads
calmly. `uppercase` and `tracking-wide` do nothing harmful in Arabic: the stylesheet resets tracking
under `[lang='ar']`, and Arabic has no case.
