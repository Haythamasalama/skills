<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { allItems, avatarOf, CATEGORIES, inCategory, OWNER, recommended, search } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import FilterChips from '../components/FilterChips.vue';
import { installCommands, REPO } from '../install';

const props = defineProps<{ tab: 'skills' | 'recommended' }>();

const ALL = 'All';
const category = ref(ALL);
const query = ref('');
const box = ref<HTMLInputElement>();

watch(() => props.tab, () => (category.value = ALL));

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
  command: string;
  tags: string[];
}

const ownAvatar = avatarOf(`${OWNER}/skills`);

const base = computed<Row[]>(() =>
  props.tab === 'skills'
    ? allItems.map(item => ({
        key: item.name,
        name: item.name,
        summary: item.summary,
        by: REPO,
        avatar: ownAvatar,
        href: `#/item/${item.name}`,
        external: false,
        command: installCommands(item)[0].text,
        tags: item.tags,
      }))
    : recommended.map(skill => ({
        key: skill.source + skill.name,
        name: skill.name,
        summary: skill.summary,
        by: skill.source,
        avatar: skill.avatar,
        href: skill.url,
        external: true,
        command: skill.command,
        tags: skill.tags,
      })),
);

const searched = computed(() => base.value.filter(row => matches(`${row.name} ${row.summary} ${row.by} ${row.tags.join(' ')}`)));
const rows = computed(() => searched.value.filter(row => !categoryId.value || inCategory(row.tags, categoryId.value)));

const options = computed(() => [
  { label: ALL, count: searched.value.length },
  ...CATEGORIES.map(c => ({ label: c.label, count: searched.value.filter(row => inCategory(row.tags, c.id)).length })).filter(o => o.count),
]);

const hits = computed(() => (props.tab === 'skills' && terms.value.length ? search(query.value, 8) : []));

const install = computed(() =>
  props.tab === 'skills'
    ? { note: 'Pick from the list, or add --skill <name> for one', text: `npx skills add ${REPO}` }
    : { note: 'Copy the command from a row, or fill in the source and skill name', text: 'npx skills add <owner/repo> --skill <name>' },
);

const tabs = [
  { id: 'skills', label: 'My skills', to: '#/', count: allItems.length },
  { id: 'recommended', label: 'Recommended', to: '#/recommended', count: recommended.length },
];

const onKey = (e: KeyboardEvent) => {
  if (e.key === '/' && document.activeElement !== box.value) {
    e.preventDefault();
    box.value?.focus();
  }
};

onMounted(() => addEventListener('keydown', onKey));
onUnmounted(() => removeEventListener('keydown', onKey));

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
      <p class="mt-3 max-w-[60ch] text-[17px] leading-[1.7] text-soft">
        Playbooks for Claude Code and other coding agents: mine, and the ones I recommend from others, each
        installed with the standard skills CLI.
      </p>
    </section>

    <nav aria-label="Lists" class="mt-10 flex gap-6 border-b border-line">
      <a
        v-for="t in tabs"
        :key="t.id"
        :href="t.to"
        class="-mb-px inline-flex items-center gap-1.5 border-b-2 pb-3 text-[15px] transition-colors"
        :class="tab === t.id ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg'"
        :aria-current="tab === t.id ? 'page' : undefined"
      >
        {{ t.label }} <span class="font-mono text-[12px] text-faint">{{ t.count }}</span>
      </a>
    </nav>

    <section :aria-label="tab === 'skills' ? 'My skills' : 'Recommended skills'" class="pt-6">
      <p class="text-[13px] text-faint">{{ install.note }}</p>
      <div class="mt-1.5 flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
        <span class="font-mono text-[13px] text-faint select-none">$</span>
        <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ install.text }}</code>
        <CopyButton :text="install.text" label="the install command" />
      </div>

      <label class="relative mt-4 flex w-full items-center">
        <span class="sr-only">Search skills</span>
        <Search class="pointer-events-none absolute left-4 size-4 text-faint" />
        <input
          ref="box"
          v-model="query"
          type="search"
          placeholder="Search skills..."
          autocomplete="off"
          class="min-h-12 w-full rounded-[14px] border border-line bg-transparent pr-10 pl-11 text-[15px] text-fg outline-none placeholder:text-faint focus:border-chip"
        />
        <kbd v-if="!query" class="absolute right-4 rounded border border-chip px-1.5 font-mono text-[11px] text-faint">/</kbd>
      </label>

      <FilterChips v-model="category" class="mt-4" :options="options" label="Filter by category" />

      <div class="mt-6 flex flex-col divide-y divide-line border-y border-line">
        <a
          v-for="row in rows"
          :key="row.key"
          :href="row.href"
          :target="row.external ? '_blank' : undefined"
          :rel="row.external ? 'noopener' : undefined"
          class="flex items-center gap-4 px-2 py-4 transition-colors hover:bg-raised"
        >
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

          <span class="flex min-w-0 flex-auto flex-col gap-0.5">
            <span class="flex flex-wrap items-baseline gap-x-2">
              <span class="font-mono text-[15px] font-medium text-fg">{{ row.name }}</span>
              <span class="font-mono text-[12px] text-faint">{{ row.by }}</span>
            </span>
            <span class="text-[14px] leading-[1.55] text-muted">{{ row.summary }}</span>
          </span>

          <span class="shrink-0" @click.prevent.stop>
            <CopyButton :text="row.command" :label="`the install command for ${row.name}`" />
          </span>
        </a>

        <p v-if="!rows.length" class="px-2 py-10 text-center text-[15px] text-muted">Nothing matches “{{ query }}”.</p>
      </div>

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
