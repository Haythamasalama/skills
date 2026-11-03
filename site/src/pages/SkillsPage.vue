<script setup lang="ts">
import { Check, Minus, Search } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { allItems, avatarOf, CATEGORIES, inCategory, OWNER, recommended, search } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import FilterChips from '../components/FilterChips.vue';
import { installCommands, REPO } from '../install';
import { pickKey, picks } from '../picks';
import { formatInstalls, type Listing, searchSkillsSh } from '../skillssh';

const props = defineProps<{ tab: 'skills' | 'recommended' | 'skillssh'; q: string }>();

const ALL = 'All';
const category = ref(ALL);
const query = ref(props.q);
const box = ref<HTMLInputElement>();

const withQuery = (to: string) => (query.value.trim() ? `${to}?${new URLSearchParams({ q: query.value.trim() })}` : to);

watch(() => props.q, q => q !== query.value.trim() && (query.value = q));

// replaceState, not a new hash: typing must not fill the history or fire hashchange on every letter.
watch(query, () => {
  const next = withQuery(location.hash.split('?')[0] || '#/');

  if (next !== location.hash) history.replaceState(history.state, '', next);
});

const suggestions = ['laravel', 'vue', 'testing', 'design', 'git', 'security'];

watch(() => props.tab, () => (category.value = ALL));

const local = computed(() => props.tab !== 'skillssh');
const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));
const matches = (text: string) => terms.value.every(t => text.toLowerCase().includes(t));
const categoryId = computed(() => CATEGORIES.find(c => c.label === category.value)?.id);

interface Row {
  key: string;
  name: string;
  summary: string;
  by: string;
  avatar: string | null;
  href: string;
  external: boolean;
  from: string;
  command: string;
  tags: string[];
}

const ownAvatar = avatarOf(`${OWNER}/skills`);

const remote = ref<Listing[]>([]);
const status = ref<'idle' | 'loading' | 'done' | 'error'>('idle');
let controller: AbortController | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  [() => props.tab, query],
  () => {
    clearTimeout(timer);
    controller?.abort();

    const q = query.value.trim();

    if (local.value || q.length < 2) {
      remote.value = [];
      status.value = 'idle';
      return;
    }

    status.value = 'loading';
    timer = setTimeout(async () => {
      controller = new AbortController();

      try {
        remote.value = await searchSkillsSh(q, controller.signal);
        status.value = 'done';
      } catch (error) {
        if ((error as Error).name !== 'AbortError') status.value = 'error';
      }
    }, 250);
  },
  { immediate: true },
);

const base = computed<Row[]>(() => {
  if (props.tab === 'skills') {
    return allItems.map(item => ({
      key: item.name,
      name: item.name,
      summary: item.summary,
      by: REPO,
      avatar: ownAvatar,
      href: `#/item/${item.name}`,
      external: false,
      from: REPO,
      command: installCommands(item)[0].text,
      tags: item.tags,
    }));
  }

  if (props.tab === 'recommended') {
    return recommended.map(skill => ({
      key: skill.source + skill.name,
      name: skill.name,
      summary: skill.summary,
      by: skill.source,
      avatar: skill.avatar,
      href: skill.url,
      external: true,
      from: skill.from,
      command: skill.command,
      tags: skill.tags,
    }));
  }

  return remote.value.map(skill => ({
    key: skill.url,
    name: skill.name,
    summary: formatInstalls(skill.installs),
    by: skill.source,
    avatar: skill.avatar,
    href: skill.url,
    external: true,
    from: skill.from,
    command: `npx skills add ${skill.from} --skill ${skill.name}`,
    tags: [],
  }));
});

// skills.sh already searched on its side, so only the local lists filter here.
const searched = computed(() =>
  local.value ? base.value.filter(row => matches(`${row.name} ${row.summary} ${row.by} ${row.tags.join(' ')}`)) : base.value,
);
const rows = computed(() => searched.value.filter(row => !categoryId.value || inCategory(row.tags, categoryId.value)));

const options = computed(() => [
  { label: ALL, count: searched.value.length },
  ...CATEGORIES.map(c => ({ label: c.label, count: searched.value.filter(row => inCategory(row.tags, c.id)).length })).filter(o => o.count),
]);

const hits = computed(() => (props.tab === 'skills' && terms.value.length ? search(query.value, 8) : []));

const installAll = `npx skills add ${REPO}`;

const tabs = [
  { id: 'skills', label: 'My skills', to: '#/', count: allItems.length },
  { id: 'recommended', label: 'Recommended', to: '#/recommended', count: recommended.length },
  { id: 'skillssh', label: 'Explore', to: '#/explore', count: null },
];

const isPicked = (row: Row) => picks.has(pickKey(row));

function toggle(row: Row) {
  if (isPicked(row)) picks.delete(pickKey(row));
  else picks.set(pickKey(row), { from: row.from, name: row.name });
}

const pickedHere = computed(() => rows.value.filter(isPicked).length);
const allPicked = computed(() => rows.value.length > 0 && pickedHere.value === rows.value.length);

function toggleAll() {
  const pickAll = !allPicked.value;

  for (const row of rows.value) {
    if (pickAll) picks.set(pickKey(row), { from: row.from, name: row.name });
    else picks.delete(pickKey(row));
  }
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== box.value) {
    e.preventDefault();
    box.value?.focus();
  }
};

onMounted(() => addEventListener('keydown', onKey));
onUnmounted(() => {
  removeEventListener('keydown', onKey);
  clearTimeout(timer);
  controller?.abort();
});

const highlight = (snippet: string) => {
  const escaped = snippet.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
  const pattern = terms.value.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

  return pattern ? escaped.replace(new RegExp(`(${pattern})`, 'gi'), '<mark class="rounded-sm bg-iris-500/25 text-fg">$1</mark>') : escaped;
};
</script>

<template>
  <div>
    <section class="pt-16 md:pt-[88px]">
      <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">Skills</h1>
      <div class="mt-6 flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
        <span class="font-mono text-[13px] text-faint select-none">$</span>
        <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ installAll }}</code>
        <CopyButton :text="installAll" label="the install command" />
      </div>
    </section>

    <section :aria-label="tabs.find(t => t.id === tab)?.label" class="mt-14">
      <label class="relative flex w-full items-center">
        <span class="sr-only">Search skills</span>
        <Search class="pointer-events-none absolute left-4 size-4 text-faint" />
        <input
          ref="box"
          v-model="query"
          type="search"
          :placeholder="local ? 'Search skills...' : 'Search all of skills.sh...'"
          autocomplete="off"
          class="min-h-12 w-full rounded-[14px] border border-line bg-transparent pr-10 pl-11 text-[15px] text-fg outline-none placeholder:text-faint focus:border-chip"
        />
        <kbd v-if="!query" class="absolute right-4 rounded border border-chip px-1.5 font-mono text-[11px] text-faint">/</kbd>
      </label>

      <nav aria-label="Lists" class="mt-6 flex gap-6 border-b border-line">
        <a
          v-for="t in tabs"
          :key="t.id"
          :href="withQuery(t.to)"
          class="-mb-px inline-flex items-center gap-1.5 border-b-2 pb-3 text-[15px] transition-colors"
          :class="tab === t.id ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg'"
          :aria-current="tab === t.id ? 'page' : undefined"
        >
          {{ t.label }} <span v-if="t.count !== null" class="font-mono text-[12px] text-faint">{{ t.count }}</span>
        </a>
      </nav>

      <FilterChips v-if="local" v-model="category" class="mt-4" :options="options" label="Filter by category" />

      <div class="flex flex-col divide-y divide-line border-b border-line" :class="{ 'mt-4 border-t': local }">
        <div v-if="rows.length" class="px-2 py-1.5">
          <button
            type="button"
            role="checkbox"
            :aria-checked="allPicked ? 'true' : pickedHere ? 'mixed' : 'false'"
            class="-ml-1 inline-flex min-h-8 cursor-pointer items-center gap-2 pr-2 text-[13px] text-muted transition-colors hover:text-fg"
            @click="toggleAll"
          >
            <span class="inline-flex size-8 items-center justify-center">
              <span
                class="inline-flex size-[18px] items-center justify-center rounded-[5px] border transition-colors"
                :class="pickedHere ? 'border-fg bg-fg text-bg' : 'border-chip text-transparent'"
              >
                <component :is="allPicked || !pickedHere ? Check : Minus" class="size-3" :stroke-width="3" />
              </span>
            </span>
            {{ pickedHere ? `${pickedHere} of ${rows.length} selected` : `Select all ${rows.length}` }}
          </button>
        </div>

        <div v-for="row in rows" :key="row.key" class="relative flex items-center gap-3 px-2 py-4 transition-colors hover:bg-raised">
          <button
            type="button"
            role="checkbox"
            :aria-checked="isPicked(row)"
            :aria-label="`Select ${row.name}`"
            class="relative z-10 -ml-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center"
            @click="toggle(row)"
          >
            <span
              class="inline-flex size-[18px] items-center justify-center rounded-[5px] border transition-colors"
              :class="isPicked(row) ? 'border-fg bg-fg text-bg' : 'border-chip text-transparent hover:border-muted'"
            >
              <Check class="size-3" :stroke-width="3" />
            </span>
          </button>

          <img
            v-if="row.avatar"
            :src="row.avatar"
            :alt="row.by.split('/')[0]"
            width="36"
            height="36"
            loading="lazy"
            class="avatar-edge size-9 shrink-0 rounded-full"
          />
          <span v-else class="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[13px] text-mark">
            {{ row.by.slice(0, 1).toUpperCase() }}
          </span>

          <span class="ml-1 flex min-w-0 flex-auto flex-col gap-0.5">
            <span class="flex flex-wrap items-baseline gap-x-2">
              <a
                :href="row.href"
                :target="row.external ? '_blank' : undefined"
                :rel="row.external ? 'noopener' : undefined"
                class="font-mono text-[15px] font-medium text-fg outline-none after:absolute after:inset-0 focus-visible:after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-accent"
              >
                {{ row.name }}
              </a>
              <span class="font-mono text-[12px] text-faint">{{ row.by }}</span>
            </span>
            <span class="text-[14px] leading-[1.55] text-muted">{{ row.summary }}</span>
          </span>

          <span class="relative z-10 shrink-0">
            <CopyButton :text="row.command" :label="`the install command for ${row.name}`" />
          </span>
        </div>

        <p v-if="!rows.length" class="px-2 py-10 text-center text-[15px] text-muted">
          <template v-if="local">Nothing matches “{{ query }}”.</template>
          <template v-else-if="status === 'idle'">
            skills.sh needs at least two letters. Try
            <template v-for="(word, i) in suggestions" :key="word">
              <button type="button" class="cursor-pointer font-mono text-fg underline decoration-chip underline-offset-4 hover:decoration-fg" @click="query = word">{{ word }}</button>{{ i < suggestions.length - 1 ? ', ' : '.' }}
            </template>
          </template>
          <template v-else-if="status === 'loading'">Searching skills.sh…</template>
          <template v-else-if="status === 'error'">skills.sh did not answer. Try again in a moment.</template>
          <template v-else>Nothing on skills.sh matches “{{ query }}”.</template>
        </p>
      </div>

      <p v-if="local && query.trim().length > 1" class="mt-4 text-[14px] text-muted">
        Not here?
        <a :href="withQuery('#/explore')" class="link-muted text-fg">Search skills.sh for “{{ query.trim() }}”</a>
      </p>

      <div v-if="hits.length" class="mt-12">
        <h2 class="eyebrow">Inside the files</h2>
        <div class="mt-3 flex flex-col divide-y divide-line">
          <a
            v-for="h in hits"
            :key="h.item.name + h.file.path"
            :href="`#/item/${h.item.name}/${h.file.path}`"
            class="flex flex-col gap-1 px-2 py-3 transition-colors hover:bg-raised"
          >
            <span class="font-mono text-xs text-faint"><span class="text-fg">{{ h.item.name }}</span> / {{ h.file.path }}</span>
            <span class="text-[14px] leading-[1.6] text-muted [overflow-wrap:anywhere]" dir="auto" v-html="highlight(h.snippet)" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
