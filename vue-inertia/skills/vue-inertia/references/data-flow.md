# Data flow

**Read when:** shaping what a controller sends to a page, reading shared props, deciding where a
piece of state lives, typing props, checking a permission in a template, or building a URL.
**Owns:** props from the server, shared props, partial reloads, state placement, TypeScript types,
permissions in templates, routes and navigation, JSON reads outside a page visit.

## TL;DR

- The server owns data and validation. A page renders typed props and submits forms.
- No client data layer for page data: no REST client, no query cache, no client router.
- Every prop key is always present (`null`, never missing) and named in `snake_case`.
- Never name a page prop after a shared prop: the page prop silently replaces it.
- State lives in props, then the URL, then a module-scoped composable. No store library by default.
- Templates hide what the viewer may not use with `can()`; the route refuses it regardless.
- Every URL comes from a Wayfinder helper. Internal links are `<Link>`.

## The model

| Concern | Inertia app | Not |
|---|---|---|
| page data | controller props, present on first render | fetching on mount |
| refresh | re-visit, or `router.reload({ only: ['invoices'] })` | invalidating a client cache |
| write | `useForm().post()`; `processing` and `errors` come with it | a REST call with hand-made loading and error refs |
| validation errors | Form Request → `form.errors.field` | parsing an error envelope |
| navigation | `<Link>`, `router.visit()` | a client router |

If you reach for a fetch client to load page data, the data belongs in the controller's props.

## Props

```php
public function index(IndexInvoiceRequest $request): Response
{
    return Inertia::render('Invoices/Index', [
        'invoices' => Invoice::query()
            ->with('customer')
            ->filter($request->validated())
            ->paginate($request->integer('per_page', 20))
            ->through(fn (Invoice $invoice) => [
                'id' => $invoice->id,
                'number' => $invoice->number,
                'customer_name' => $invoice->customer->name,
                'status' => ['tone' => $invoice->status->tone(), 'label' => $invoice->status->label()],
            ]),
        'filters' => $request->validated(),
    ]);
}
```

```vue
<script setup lang="ts">
import type { InvoiceFilters, InvoiceRow, Paginated } from '@/types';

defineProps<{ invoices: Paginated<InvoiceRow>; filters: InvoiceFilters }>();
</script>
```

- **Props are the source of truth.** Do not copy one into a `ref` and mutate it; re-visit instead.
- **Send only what the page reads.** Every prop is serialised into the first HTML response and can
  be read in the page source, so a field the viewer may not see is left out on the server, not hidden
  with `v-if`. Never send a raw model.
- **Eager-load before mapping**, or each row lazy-loads its relation.
- **Echo filters from `validated()`**, never `all()`. A filter key with no rule is dropped by
  `validated()` and silently does nothing.
- **Resolve ids to names on the server.** Send `customer_name`, not `customer_id`; a reader can do
  nothing with a foreign key.
- **Labels come from the server.** An enum's label and its tone are sent with it; Vue never builds
  an enum translation key.
- A section that queries many rows can load after the page with `Inertia::defer()` and show a
  `Skeleton` meanwhile (Inertia 3, checked 2026-11-03).
- Larger apps can move each page's array into one props class per page (Inertia's
  `ProvidesInertiaProperties`), so the shape has one home that a test can read.

### Never name a page prop after a shared prop

`HandleInertiaRequests::share()` reaches every page. A page prop with the same name **replaces** the
shared one on that page only, and no type check or test catches it: a page that sends its own
`permissions` breaks every `can()` call on that screen. Qualify the page prop instead
(`permissionCatalogue`, `statusCounts`) and check the shared list before naming one.

## Shared props

```php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'auth' => [
            'user' => $request->user()?->only('id', 'name', 'email'),
            'permissions' => fn () => $request->user()?->permissionNames() ?? [],
        ],
        'locale' => app()->getLocale(),
        'direction' => app()->getLocale() === 'ar' ? 'rtl' : 'ltr',
        'translations' => fn () => $this->uiTranslations(),
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
    ];
}
```

- Share only what nearly every page needs. A closure is computed only when the response is built.
- The TypeScript side is the `SharedProps` type in [blueprint.md](blueprint.md#typesindexts).

## State: props, URL, composable

| Home | Holds |
|---|---|
| props | all server data |
| URL query | filters, sort, current page, active tab |
| a composable with module-scoped state | client-only UI that outlives a page: theme, sidebar, table density |
| a component's local `ref` | state for one page or component |

Why the URL: a filtered list is a link someone can send, the back button works, and the controller
echoes the filters it applied, so the controls and the data never disagree. The list wiring is
`useListFilters` ([lists.md](lists.md)).

A cross-page composable declares its `ref` outside the exported function (inside, every call gets a
new one) and guards every `window` and `document` touch for SSR. A store library is a decision to
argue for, not a default.

## Partial reloads

```ts
router.reload({ only: ['invoices'] });
```

The controller runs again but only the named keys come back. Use it to refresh one list or status
without rebuilding the rest. `preserveState` and `preserveScroll` keep local UI and the scroll
position across a visit.

## Reads outside a page visit

Data that loads after the page or outlives it (a badge count, a polled status, a search picker's
options) comes from a JSON endpoint. Send `Accept: application/json` and `X-Requested-With`, so
Laravel answers errors as JSON. Wrap `fetch` once in `lib/http.ts` and call that, never `fetch` in a
component. A save that changes what the page shows is still an Inertia visit, so the props refresh and
the flash toast shows. Adding a client cache library is a dependency decision to raise first.

## Types

```
types/
  index.ts        SharedProps, the Inertia augmentation, re-exports
  pagination.ts   Paginated<T>
  invoice.ts      Invoice, InvoiceRow, InvoiceStatus, InvoiceFilters
```

- `type` aliases, `PascalCase`, one area per file, exported through `index.ts`.
- No `any` for a prop. A missing shape gets a type.
- Backend enums become string-literal unions, not TS `enum`.
- A slim `*Row` type for list pages (`Pick<Invoice, 'id' | 'number'> & { customer_name: string }`), so
  a list never ships the whole record.
- One `Paginated<T>` for every paginated prop.
- Nothing generates these types: change the controller's array and its type in the same commit, so a
  reviewer reads the two side by side.

## Permissions

```ts
// lib/permissions.ts
import { usePage } from '@inertiajs/vue3';

export const can = (permission: string): boolean => usePage().props.auth.permissions.includes(permission);
export const canAny = (permissions: string[]): boolean => permissions.some(can);
```

```vue
<Link v-if="can('invoices.create')" :href="invoices.create().url" :class="buttonVariants()">…</Link>
```

- Read permissions only from shared props through `can()`; never infer them from a role name.
- `v-if`, not `v-show` or CSS: an action the viewer may not use is absent from the DOM.
- A rule about the record (still a draft, written by this viewer) is a `can_*` field the server
  computes on that record: `invoice.can_cancel`. A rule about the viewer alone is `can()`. Both
  together are joined with `&&`.
- Page-level authorization is route middleware or a policy, so an unauthorized viewer never receives
  the props. There is no client route guard.
- Permission strings are `<resource>.<action>` (`invoices.update`).

## Routes and navigation

```ts
import invoices from '@/routes/invoices';

invoices.index().url;
invoices.edit(invoice.id).url;
```

- Every URL comes from a Wayfinder helper (`@/routes/...` by route name, `@/actions/...` by
  controller). Never a hand-written path: a renamed route then fails the type check instead of 404ing.
- `resources/js/routes`, `actions` and `wayfinder` are generated by the Vite plugin or
  `php artisan wayfinder:generate`, and gitignored. Never edit them.
- Import a route from its own module, not from a parent index that re-exports every route: the
  bundler cannot drop the unused ones.
- A route registered only in some environments (a local-only tool) has no helper in a production
  build, so referencing one fails that build. Write those few URLs as literals.
- `<Link>` for a link to an Inertia page; `router.visit()` / `router.get()` / `router.post()` in code.
- A plain `<a>` for an external URL, a page that is not Inertia, a file download or export, and a
  URL the server sent in props. Inertia must not intercept a file.
- After a sign-in or a language change, load the next page in full (`window.location.href`), not a
  visit: the shared permissions and translations were computed for the old state.
- Success is the server's redirect plus flash. The page never navigates itself after a write.

## Self-check

- [ ] Page data arrives as typed props; no fetch client for page data.
- [ ] No page prop shadows a shared prop name.
- [ ] Every key present, `snake_case`, ids resolved to names, labels from the server.
- [ ] Filters, sort and page live in the URL.
- [ ] Every action behind `can()` or a record's `can_*`, and the server enforces the same rule.
- [ ] Internal links use `<Link>` and generated route helpers.
