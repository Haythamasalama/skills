# Forms, record pages, lists and toasts

## Forms

```ts
const form = useForm({ name: '', email: '' });

const schema = computed(() =>
    z.object({
        name: z.string().min(1, t('validation.required')),
        email: z.string().min(1, t('validation.required')).email(t('validation.invalid_email')),
    }),
);

const { clientErrors, validate } = useClientValidation(schema);

const errorFor = (field: string): string | undefined =>
    clientErrors.value[field] ?? (form.errors as Record<string, string | undefined>)[field];

function submit() {
    if (!validate(form.data())) {
        return;
    }

    form.post(admin.customers.store().url);
}
```

```vue
<form novalidate @submit.prevent="submit">
    <FieldGroup>
        <FormField :label="t('fields.name')" for="name" :error="errorFor('name')">
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <Building2Icon class="size-4" />
                </InputGroupAddon>
                <InputGroupInput id="name" v-model="form.name" :aria-invalid="!!errorFor('name') || undefined" required autofocus />
            </InputGroup>
        </FormField>

        <Field orientation="horizontal">
            <Button type="submit" :class="equalAction" :disabled="form.processing">
                <Spinner v-if="form.processing" />
                <SaveIcon v-else />
                {{ t('common.save') }}
            </Button>
        </Field>
    </FieldGroup>
</form>
```

`useClientValidation` is a small composable: run `schema.safeParse(data)`, flatten the issues into
`{ [path]: message }`, return whether it passed.

Rules:

- **`novalidate` is required.** Without it the browser's own bubble fires first and zod never runs.
- **zod before, the Form Request after, same slot.** Both errors render through `:error` on the
  field.
- **Bind `:error` on every field**, the confirmation field included. An unbound one swallows its
  message and the submit looks dead.
- **`:aria-invalid="!!error || undefined"` on the control**, next to `:error` on the field. `Field`
  styles itself from `data-invalid`, but the ring on an `Input` (and on a whole `InputGroup`) comes
  from `aria-invalid` on the control.
- **A text field leads with an icon** in an `InputGroupAddon` (mail, globe, database, server, key).
  A field that already has a meaningful affix (`db_`, `.example.test`) keeps the affix instead.
  A combobox trigger has its own chevron.
- **The submit stands alone**, in a `Field orientation="horizontal"` inside the `FieldGroup`, so it
  inherits the field gap. No Cancel.
- **Labels inside a titled card are bare.** The card says «مالك الحساب», so the fields are
  «البريد الإلكتروني» and «رقم الجوال», not «بريد المالك» repeated down the column.
- **A field component shared by Create and Edit takes a merged `errors` prop**
  (`{ ...form.errors, ...clientErrors }`), or client errors never reach it.
- **A phone number is one phone component**, never a hand-rolled code + number pair. It writes the
  dial code into its own field, so the payload stays two plain columns. Seed the default dial code
  in the create form's data: the widget showing a default is not the form holding one.

## Tabbed forms and per-language fields

`TabsContent` unmounts the panel it isn't showing, so errors on a hidden tab are invisible:

1. Put a `bg-destructive` dot on each `TabsTrigger` whose fields have errors.
2. `watch` the merged errors and switch `activeTab` to the first tab with one.

A per-language tabs component for a translatable field needs the same, because the Arabic pane
being filled says nothing about the English one. Give it the merged errors and the fields that
instance renders:

```vue
<LocaleTabs v-slot="{ locale, required }" :errors="allErrors" :fields="['name', 'description']">
```

Two things must line up for the dot to appear:

1. The server reports `name.en`, so **the zod schema must use the same path** (for example
   `path: [fallbackLocale]` inside the `refine` on `name`). An error on bare `name` has no field
   bound to it: it renders nowhere and the submit looks dead.
2. `fields` names only the fields **that instance** renders. On a page with several locale tab
   strips, one field's error would otherwise light every strip.

## Showing a record

A read-only field is a detail card (icon, muted label, value under it) in a grid, never a `Table`:

```vue
<div class="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <DetailCard :label="t('fields.status')" :icon="ActivityIcon">
        <StatusBadge :tone="customer.status.tone" :label="customer.status.label" />
    </DetailCard>

    <DetailCard v-for="row in detailRows" :key="row.label" :label="row.label" :icon="row.icon">
        <span v-if="row.value" :dir="row.ltr ? 'ltr' : undefined">{{ row.value }}</span>
        <span v-else class="text-muted-foreground">—</span>
    </DetailCard>
</div>
```

- **A date and its time go on two lines.** Never `2026-09-21 16:58:18` on one, where the eye has to
  find the split in a run of digits. The server can keep sending `toDateTimeString()`; the
  component splits it.
- **A value is never truncated.** A URL or a database name is the point of the card, so it wraps.
- **Show the name, not the key.** Resolve `plan_id` to the plan's name in the controller and send
  `plan_name`. A reader can do nothing with a foreign key.
- **Every card has an icon**, so the grid scans by shape.
- **Missing is an em dash** in `text-muted-foreground`, never a blank.

## Lists

The toolbar is shadcn's data-table toolbar: a text `Input`, a faceted filter per option set, and a
ghost Reset that appears once anything is set.

```ts
const { filters, active, reset } = useListFilters({
    name: props.filters.name ?? '',
    is_active: props.filters.is_active ?? '',
});
```

- Filters reload the page **debounced** and **reset `page`**, so a narrowed list never strands the
  reader on a page that no longer exists.
- **Every filter key needs a rule in the index Form Request**, or `validated()` drops it and the
  filter silently does nothing.
- The table wrapper owns the card, the empty row and the pagination footer, so every list looks the
  same.

## Toasts

`lib/flash.ts` listens to the Inertia router once, at boot:

- a GET stays silent;
- **every write reports**: the controller's flashed `success` or `error`, or a generic outcome;
- failures come from the router's `error`, `httpException` and `networkError` events (the
  Inertia 3 names; Inertia 2 called the last two `invalid` and `exception`).

Pages never call `toast()` for the result of a request. They let the controller flash.

vue-sonner's stylesheet sets its own font stack and is imported unlayered, so a `font-sans` class on
`<Toaster>` loses. Put the toaster back on `--font-sans` with an unlayered override (see
`theme.md`).
