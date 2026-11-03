# Presentation with Inertia and Vue

**Read when:** the app renders Inertia + Vue 3 + TypeScript pages instead of Blade or a JSON API.
**Owns:** the data flow (props in, forms out), shared props, state placement, form validation, types,
naming, permission checks in templates.
**See also:** [screens.md](screens.md) · [forms.md](forms.md)

## TL;DR

- The server owns data and validation. A page renders typed props and submits forms.
- No client data layer for page data: no REST client, no query cache, no client router.
- Writes use Inertia's `<Form>` / `useForm`, end in a server redirect plus a flash, and read errors from
  the form object.
- State lives, in order of preference: props (server data), the URL (filters, sort, page, tab), a
  composable with module-scoped state (client-only, cross-page UI).
- Every prop is typed with `defineProps<T>()`; no `any`.
- The `Inertia::render('Area/Name')` string equals `resources/js/pages/Area/Name.vue`.
- Templates guard actions with a `can()` helper fed by shared props. The server enforces the same check.
- Internal links use `<Link>` with generated route helpers, never `<a href>` or a hand-written path.

## The model

| Concern | Inertia app | Not |
|---|---|---|
| Page data | controller props, present on first render | fetching on mount |
| Refresh | re-visit the URL, or `router.reload({ only: ['invoices'] })` | invalidating a client cache |
| Write | `useForm().post()`; `processing` and `errors` are built in | a REST call with hand-made loading and error refs |
| Validation errors | Form Request → `form.errors.field` | parsing an error envelope by hand |
| Navigation | `<Link>`, `router.visit()` | a client router |

If you reach for a fetch client to load page data, the data belongs in the controller's props instead.
JSON endpoints are the exception (polling a status, a machine-to-machine API) and return Resources.

## Props

```php
return Inertia::render('Invoices/Index', [
    'invoices' => InvoiceResource::collection(
        $this->invoices->getInvoices($filters, withRelations: ['customer'])->pagination()
    ),
    'filters' => $request->validated(),
]);
```

```vue
<script setup lang="ts">
import type { InvoiceFilters, InvoiceRow, Paginated } from '@/types'

const props = defineProps<{
  invoices: Paginated<InvoiceRow>
  filters: InvoiceFilters
}>()
</script>
```

- Props are the source of truth. Do not copy one into a `ref` and mutate it as local state.
- Eager-load before passing; Inertia serializes every prop on every response, so an unloaded relation
  lazy-loads per row.
- Echo filters from `validated()` or `only(...)`, never from `all()`.
- Prefer a trimmed Resource or read DTO over a raw model when the shape matters.

### Never name a page prop after a shared prop

Shared props from `HandleInertiaRequests::share()` (`auth`, `flash`, `permissions`, …) reach every page.
A page prop with the same name **replaces** the shared one on that page only, and nothing warns you.
Qualify the page prop instead (`permissionCatalogue`, `statusCounts`). Why: in one codebase a page's own
`permissions` prop silently broke every permission check on that screen.

## Shared props

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user()?->only('id', 'name'),
            'permissions' => $request->user()?->permissionNames() ?? [],
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
    ];
}
```

Share the minimum. Everything shared is sent on every response and visible in the page source.

## Writes

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { store } from '@/routes/invoices'

const form = useForm({ customer_id: null as number | null, currency: 'USD', notes: '' })

const submit = () => form.post(store().url, { preserveScroll: true })
</script>
```

1. `form.processing` is true while in flight: bind it to the submit button's `disabled`.
2. A failed Form Request fills `form.errors.field`. Read errors there, never from a local ref.
3. Success is the server's redirect plus flash. Do not navigate yourself on success.

### Client validation

A client schema (zod, for example) gives instant feedback; the Form Request stays authoritative and
re-checks everything. With Inertia's `<Form>`: add `novalidate` (the browser bubble is unstyled and
untranslatable), cancel the visit from `onBefore` when the schema fails, and show
`clientErrors.field ?? errors.field` so the server's message takes over after a submit. Keep field names
identical across the schema, the form and the Form Request, since that key routes a server error to its
field. Write messages as instructions ("Enter the due date."), not diagnostics ("Due date is required.").

Never let a passing client check imply something is safe or allowed; anything security-relevant is
decided only on the server.

## State: props, URL, composable

| Home | Holds |
|---|---|
| Props | all server data |
| URL query | filters, sort, current page, active tab |
| Composable with module-scoped state | client-only UI that outlives a page: theme, sidebar, table density |
| A component's local `ref` | state for one page or component |

```ts
watch(status, (value) => router.get(index().url, { status: value }, { preserveState: true, replace: true }))
```

Why the URL: a filtered list is a link someone can send, the back button works, and the controller echoes
the same filters it applied, so the controls and the data never disagree. Wrap the debounce, empty-value
stripping and `preserveState` / `preserveScroll` / `replace` options in one shared composable.

A cross-page composable declares its `ref` **outside** the exported function (inside, every call gets a
new one) and guards every `window` / `document` touch for SSR. Adding a store library is a decision to
argue for, not a default.

## Types

```
resources/js/types/
  index.ts          barrel: export everything
  invoice.ts        Invoice, InvoiceRow, InvoiceStatus
  shared.ts         SharedProps, AuthUser, FlashMessages
  pagination.ts     Paginated<T>
```

- `type` aliases, `PascalCase` names, `kebab-case` files, exported through the barrel.
- Backend enums become string-literal unions, not TS `enum`.
- A slim `*Row` type for list pages (`Pick<Invoice, 'id' | 'number' | 'status'> & { customer_name: string }`),
  so a list never ships the full entity.
- One `Paginated<T>` (`data`, `meta`, `links`) for every paginated prop.
- `usePage<SharedProps>()` everywhere shared props are read.
- Prefer generated route and action helpers (Wayfinder or similar) over typed-by-hand URLs.

## Naming

- Pages: `resources/js/pages/<Area>/<Name>.vue`, `PascalCase` area folders and files (`Invoices/Index.vue`,
  `Show`, `Create`, `Edit`). The render string matches exactly; a mismatch is the most common Inertia 404.
- No filesystem routing: an id is a server route parameter, never a `[id]` folder.
- If a layout resolver picks layouts by page-name prefix, renaming an area means updating the resolver in
  the same change; otherwise the page silently falls back to the default layout. The match is case-sensitive.
- Components: `PascalCase.vue` in lowercase feature folders (`components/invoices/InvoiceTotals.vue`).
- Other files `kebab-case`: `composables/use-invoice-form.ts` exports `useInvoiceForm()`; `lib/format-money.ts`
  exports `formatMoney()`. Predicates start with `is` / `has`.
- `use` prefix only for functions that own reactive state or wrap Inertia/lifecycle behaviour.
- Permission strings `<resource>.<action>` (`invoices.update`).

## Permissions in templates

```ts
export function can(permission: string): boolean {
  return usePage<SharedProps>().props.auth.permissions.includes(permission)
}
```

```vue
<Button v-if="can('invoices.update')" as-child><Link :href="edit({ invoice: invoice.id }).url">Edit</Link></Button>
```

- Read permissions only from shared props through `can()` / `canAny()`; never derive them from a role
  name on the client.
- `v-if`, not `v-show` or CSS: an action the viewer may not use is absent from the DOM.
- Page-level authorization is server-side route middleware, so an unauthorized user never receives the
  page's props. There is no client route guard to rely on.
- The template check is a courtesy that avoids offering a button that answers 403. The route and the
  Action are the boundary.

## Navigation

`<Link href>` for anchors; `router.visit()` / `router.get()` / `router.post()` in code. A raw `<a>` only for
external URLs (it reloads the page and drops Inertia state). URLs come from generated helpers, never
hand-written strings.

## Self-check

- [ ] Page data arrives as props; no fetch client for page data.
- [ ] No page prop shadows a shared prop name.
- [ ] Props typed with `defineProps<T>()` from `@/types`; no `any`.
- [ ] Writes use `useForm` / `<Form>`; `processing` and `errors` come from the form.
- [ ] Success is redirect + flash; the page does not navigate itself.
- [ ] Filters, sort and page live in the URL.
- [ ] Every action behind `can()`, and the server enforces the same permission.
- [ ] Internal links use `<Link>` and generated route helpers.
- [ ] The render string equals the page file path.
