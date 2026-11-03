# Composables

**Read when:** writing or calling one of the shared composables, or adding a new one.
**Owns:** `useTranslations`, `useAppearance`, `useListFilters`, `useClientValidation`, `can` /
`canAny`, their signatures and code.

## TL;DR

- A composable owns reactive state or wraps Inertia; its file is `useX.ts` exporting `useX()`.
- State shared across pages sits in a `ref` declared outside the exported function, so every caller
  shares one value; inside, each call would get its own.
- Guard every `window`, `document` and `localStorage` touch: pages render under SSR and in private
  windows.
- `can()` and `canAny()` only read the page, so they are plain functions in `lib/permissions.ts`.

| Composable | Signature |
|---|---|
| `useTranslations` | `() => { t(key: string, replace?: Record<string, string \| number>): string }` |
| `useAppearance` | `() => { appearance: Ref<Appearance>; update(value: Appearance): void }`, plus `initializeTheme()` |
| `useListFilters` | `<T extends Record<string, string>>(url: string, initial: T, options?: { delay?: number }) => { filters: Ref<T>; dirty: ComputedRef<boolean>; clear(): void }` |
| `useClientValidation` | `<T>(schema: MaybeRefOrGetter<ZodType<T>>) => { clientErrors: Ref<Record<string, string>>; validate(data): boolean; reset(): void; revalidateOnChange(form): void }` |
| `can` / `canAny` | `(permission: string) => boolean` / `(permissions: string[]) => boolean` |

## `useTranslations`

The server shares the current locale's UI lines as `translations` (only the lang files the front end
reads, since every shared prop rides on every response).

```ts
import { usePage } from '@inertiajs/vue3';

export function useTranslations() {
    const page = usePage();

    function t(key: string, replace: Record<string, string | number> = {}): string {
        const line = key
            .split('.')
            .reduce<unknown>(
                (carry, part) => (carry && typeof carry === 'object' ? (carry as Record<string, unknown>)[part] : undefined),
                page.props.translations,
            );

        if (typeof line !== 'string') return key;

        return Object.entries(replace).reduce(
            (text, [token, value]) => text.replace(new RegExp(`:${token}(?![A-Za-z0-9_])`, 'g'), String(value)),
            line,
        );
    }

    return { t };
}
```

The bounded pattern stops `:to` from matching inside `:total`. An app with one language may write
its copy straight into templates instead; how to word it either way is [copy.md](copy.md).

## `useAppearance`

```ts
import { ref } from 'vue';

export type Appearance = 'light' | 'dark' | 'system';

const appearance = ref<Appearance>('system');

function apply(value: Appearance): void {
    const dark = value === 'dark' || (value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
}

function stored(): Appearance {
    try {
        const value = localStorage.getItem('appearance');
        return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
        return 'system';
    }
}

export function initializeTheme(): void {
    if (typeof window === 'undefined') return;

    appearance.value = stored();
    apply(appearance.value);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => appearance.value === 'system' && apply('system'));
}

export function useAppearance() {
    function update(value: Appearance): void {
        appearance.value = value;
        apply(value);
        document.cookie = `appearance=${value};path=/;max-age=31536000;SameSite=Lax`;

        try {
            localStorage.setItem('appearance', value);
        } catch {}
    }

    return { appearance, update };
}
```

- The `ref` sits outside the function, so every caller shares one value.
- The cookie lets the root view print `class="dark"` on the server, so the first paint is already
  dark. `localStorage` can throw in a private window, hence the `try`.

`app.ts` calls `initializeTheme()` once at boot, beside `syncDocumentLanguage()` and
`initializeFlashToast()` ([blueprint.md](blueprint.md#appts)).

## `useListFilters`

```ts
export const ALL = '__all__';

export function useListFilters<T extends Record<string, string>>(url: string, initial: T, options: { delay?: number } = {}) {
    const defaults = { ...initial };
    const filters = ref<T>({ ...initial });

    watchDebounced(
        filters,
        () => {
            const data = Object.fromEntries(Object.entries(filters.value).filter(([, value]) => value !== '' && value !== ALL));
            router.get(url, data, { preserveState: true, preserveScroll: true, replace: true });
        },
        { debounce: options.delay ?? 300, deep: true },
    );

    return {
        filters,
        dirty: computed(() => Object.keys(defaults).some((key) => filters.value[key] !== defaults[key])),
        clear: () => (filters.value = { ...defaults }),
    };
}
```

`router.get` to the bare list URL replaces the whole query, so an emptied filter and the old `page`
both drop out: a narrowed list never strands the reader on a page that no longer exists.

## `useClientValidation`

```ts
export function useClientValidation<T extends Record<string, unknown>>(schema: MaybeRefOrGetter<ZodType<T>>) {
    const clientErrors = ref<Record<string, string>>({});
    const submitted = ref(false);
    const reset = () => (clientErrors.value = {});

    function validate(data: Record<string, unknown>): boolean {
        submitted.value = true;
        const result = toValue(schema).safeParse(data);

        if (result.success) {
            reset();
            return true;
        }

        const next: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const field = issue.path.join('.');
            if (field && !next[field]) next[field] = issue.message;
        }
        clientErrors.value = next;

        return false;
    }

    function revalidateOnChange<F extends Record<string, unknown>>(form: { data: () => F; clearErrors: (...fields: Array<keyof F & string>) => unknown }): void {
        watch(
            () => ({ ...form.data() }),
            (next, previous) => {
                const changed = (Object.keys(next) as Array<keyof F & string>).filter((key) => next[key] !== previous[key]);
                if (changed.length) form.clearErrors(...changed);
                if (submitted.value) validate(next);
            },
        );
    }

    return { clientErrors, validate, reset, revalidateOnChange };
}
```

- One message per field, the first, so a control never stacks messages.
- The dotted path (`name.en`) matches the key Laravel uses for a nested error, so both land on the
  same field.
- Editing a field clears its server error at once; after the first submit, the schema re-runs on
  every change, so a fixed field stops showing red without another submit.

## `can` and `canAny`

The code and the rules for using them are in [data-flow.md](data-flow.md#permissions).
