# Forms

**Read when:** building a create or edit page, a form in a dialog, a tabbed form, or a field with
translations, a phone number or an affix.
**Owns:** `useForm`, client and server validation, how errors render, the field markup, the submit
row, tabbed forms and errors on a hidden tab, per-language fields, edit as a page or a modal.

## TL;DR

- `useForm` owns the payload, `processing` and the server's `errors`. Success is the server's
  redirect plus flash.
- zod checks before the request, the Form Request after; both messages render in the same slot.
- `novalidate` on every form. Bind `:error` on every field and `aria-invalid` on every control.
- A form has one submit and no Cancel.
- A tabbed form shows which tab holds an error and switches to it.
- Edit is its own page once a form has more than three fields; a modal is for one field and one decision.

## The wiring

```ts
const { t } = useTranslations();

const form = useForm({ name: '', email: '' });

const schema = computed(() =>
    z.object({
        name: z.string().min(1, t('validation.enter_name')),
        email: z.string().min(1, t('validation.enter_email')).email(t('validation.invalid_email')),
    }),
);

const { clientErrors, validate, revalidateOnChange } = useClientValidation(schema);
revalidateOnChange(form);

const errorFor = (field: string): string | undefined =>
    clientErrors.value[field] ?? (form.errors as Record<string, string | undefined>)[field];

function submit(): void {
    if (!validate(form.data())) return;

    form.post(customers.store().url, { preserveScroll: true });
}
```

```vue
<form novalidate @submit.prevent="submit">
    <FieldGroup>
        <FormField :label="t('fields.name')" for="name" :error="errorFor('name')">
            <InputGroup>
                <InputGroupAddon align="inline-start"><UserIcon /></InputGroupAddon>
                <InputGroupInput id="name" v-model="form.name" :aria-invalid="!!errorFor('name') || undefined" autofocus />
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

`useClientValidation`, `FormField` and `equalAction` are in [house-components.md](house-components.md).

### Why `useForm` and a `validate()` call

This is the default for every form. It holds values bound with `v-model`, which is what Reka's
`Select`, `Combobox` and date pickers give you; a `FormData` read of the DOM can miss them. The data is
typed, and one pattern covers page forms and dialogs alike.

A short form of plain native inputs (sign-in, a password change) may use Inertia's `<Form>` instead,
with the same composable: `:on-before` returns `false` to cancel the visit, and each field shows
`clientErrors.field ?? errors.field`. Pick one per form, never both.

## Validation

- **zod before, the Form Request after, same slot.** zod saves a round-trip; the Form Request is the
  only check that protects anything and re-checks everything, including the rules zod cannot know
  (uniqueness, ownership, quotas).
- **A passing client check implies nothing.** Never let it suggest something is safe or allowed.
- **`novalidate` is required.** Without it the browser's own bubble fires first: unstyled, in the
  browser's language, and zod never runs.
- **Field names match** across the zod schema, the form keys and the Form Request rules. That key is
  what routes a server error to its field.
- **Write messages as instructions:** "Enter the due date.", not "Due date is required."
- **Never a toast for a field error.** The field shows it; the flash listener only says the save failed.
- A Precognition setup (live server checks per field) needs `HandlePrecognitiveRequests` on the
  route, or a precognitive request runs the whole controller and can save the record. Add it only when
  a form genuinely needs live checks.

## Fields

- **Bind `:error` on every `FormField`**, the confirmation field included. An unbound one swallows
  its message and the submit looks dead.
- **`:aria-invalid="!!error || undefined"` on the control.** `Field` styles itself from
  `data-invalid`, but the red ring on an `Input`, and on a whole `InputGroup`, comes from
  `aria-invalid` on the control inside.
- **A text field leads with an icon** in an `InputGroupAddon`: mail, globe, key, user. A field with a
  meaningful affix (a URL prefix, a unit) keeps the affix instead; a combobox trigger has its own chevron.
- **Labels inside a titled card are bare.** The card says "Billing contact", so the fields say
  "Email" and "Phone", not "Billing contact email" down the column.
- **Each label names its control**: `<FormField for>` equals the control's `id`. A form that can
  appear twice on a page builds ids from `useId()` (`` `${id}-email` ``).
- **A field component shared by Create and Edit takes one merged `errors` prop**
  (`{ ...form.errors, ...clientErrors }`), or client errors never reach it.
- **A phone number is one phone component** (country picker plus number), never a hand-made pair. It
  writes the dial code into its own field, so the payload stays two plain columns. Seed the default
  dial code in the create form's data: the widget showing a default is not the form holding one.
- **Help under a field is one sentence.** How short is in [copy.md](copy.md).

## The submit row

- **One submit, no Cancel.** Leaving is what the breadcrumb and the sidebar are for; a second button
  beside the submit only competes with it. A dialog is the exception: `AlertDialogCancel` or an
  outline Cancel before the action, because a dialog has no breadcrumb.
- The submit sits in `Field orientation="horizontal"` inside the `FieldGroup`, so it inherits the
  field gap, and takes `equalAction`.
- **The label is the verb**: "Save", "Send", never "Submit".
- **Disabled while `form.processing`**, and on an edit form while `!form.isDirty`: a Save that does
  nothing still costs a round-trip and a toast.
- A form that stays on screen after saving (a dialog, a settings box) saves with `preserveScroll`
  and `preserveState`, then calls `form.defaults()` in `onSuccess`, so the saved values become the
  new starting point and `isDirty` is false again.

## Tabbed forms and errors on a hidden tab

A record with more than one section of its own fields puts them in `Tabs`, so the page stays one
screen tall. `TabsContent` unmounts the panel it is not showing, so an error on a hidden tab is
invisible and the submit looks dead. Do both:

1. A `size-1.5 rounded-full bg-destructive` dot on each `TabsTrigger` whose fields have an error.
2. A `watch` on the merged errors that switches `activeTab` to the first tab with one.

```ts
const tabOf: Record<string, string> = { name: 'details', email: 'contact', phone: 'contact' };

watch(allErrors, (errors) => {
    const first = Object.keys(errors).map((field) => tabOf[field.split('.')[0]]).find(Boolean);
    if (first) activeTab.value = first;
});
```

### Per-language fields

A translatable field gets one pane per language in a `LocaleTabs` component (a `Tabs` with one
trigger per locale), and needs the same two signals, because the Arabic pane being filled says nothing
about the English one:

```vue
<LocaleTabs v-slot="{ locale, required }" :errors="allErrors" :fields="['name', 'description']">
```

Two things must line up for the dot to appear:

1. The server reports `name.en`, so **the zod schema uses the same path** (`path: ['en']` inside the
   `refine` on `name`). An error on a bare `name` has no field bound to it and renders nowhere.
2. `fields` names only the fields **that instance** renders. A page with several `LocaleTabs` would
   otherwise light every strip for one field's error.

## Page or modal

- **Edit is its own route** when the form has more than three fields or the record has a URL worth
  sending to someone. A modal loses the back button and cannot be linked.
- **A modal fits one field and one decision**: rename, confirm, pick from a short list.
- A form page narrows itself so lines stay readable: wrap it in `mx-auto flex w-full max-w-3xl
  flex-col gap-4`. Lists and tables stay full width.
- The fields that say who or what the record is sit in a `Card` with a field grid
  (`grid gap-4 sm:grid-cols-2`); a wide field spans both columns with `sm:col-span-2`.

## A multi-step form

Keep every step in one `useForm` (one payload), hold the active step in a local `ref`, and submit
once at the end. Validate a step with `validate()` on that step's fields before moving on. A check
the server must make mid-way (testing a connection, checking an address) is its own endpoint that
neither saves nor echoes secrets back.

## Self-check

- [ ] `novalidate`; zod schema with instruction-style messages; the Form Request re-checks all.
- [ ] Every field has `:error` and its control `aria-invalid`.
- [ ] Field names identical across zod, the form and the Form Request.
- [ ] One submit with its icon, a spinner while busy, no Cancel on a page.
- [ ] A tabbed or per-language form shows the error dot and jumps to the tab.
