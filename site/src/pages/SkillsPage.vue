<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { allItems, allPacks, search } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import FilterChips from '../components/FilterChips.vue';
import PackTile from '../components/PackTile.vue';
import PageHeader from '../components/PageHeader.vue';
import { installCommands } from '../install';

const ALL = 'All';
const pack = ref(ALL);
const query = ref('');
const box = ref<HTMLInputElement>();

const options = computed(() => [
  { label: ALL, count: allItems.length },
  ...allPacks.map(p => ({ label: p.name, count: p.items.length })),
]);

const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));

const visible = computed(() =>
  allPacks
    .filter(p => pack.value === ALL || p.name === pack.value)
    .map(p => ({
      ...p,
      items: p.items.filter(item => terms.value.every(t => `${item.name} ${item.description}`.toLowerCase().includes(t))),
    }))
    .filter(p => p.items.length),
);

const hits = computed(() => (terms.value.length ? search(query.value, 12) : []));

const shortDescription = (text: string) => text.replace(/^Use when /, '').replace(/\s+—.*$/, '').replace(/^./, c => c.toUpperCase());

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
    <PageHeader title="Skills">
      <p class="animate-rise [animation-delay:.05s]">
        The playbooks I give Claude Code, grouped by
        <span class="text-gradient pr-0.5 font-serif text-[22px] italic">subject</span>. Each skill works on its own:
        pick one, copy the command, and it lands in the project's <code class="font-mono text-[15px] text-fg">.claude</code> folder.
      </p>
      <p class="animate-rise text-[15px] text-muted [animation-delay:.12s]">
        {{ allPacks.length }} packs · {{ allItems.filter(i => i.kind === 'skill').length }} skills ·
        {{ allItems.filter(i => i.kind === 'agent').length }} agent ·
        <a href="#/map" class="link-underline">see the map</a>
      </p>
    </PageHeader>

    <section aria-label="Skills" class="pt-10">
      <label class="relative flex items-center">
        <span class="sr-only">Search the skills</span>
        <Search class="pointer-events-none absolute left-3.5 size-4 text-faint" />
        <input
          ref="box"
          v-model="query"
          type="search"
          placeholder="Search names, descriptions and every file…"
          autocomplete="off"
          class="min-h-11 w-full rounded-full border border-chip bg-transparent pr-12 pl-10 text-[15px] text-fg outline-none placeholder:text-faint focus:border-fg"
        />
        <kbd v-if="!query" class="absolute right-3.5 rounded border border-chip px-1.5 font-mono text-[11px] text-faint">/</kbd>
      </label>

      <FilterChips v-model="pack" class="mt-5" :options="options" label="Filter by pack" />

      <div v-for="p in visible" :key="p.name" class="mt-12">
        <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 :id="p.name" class="eyebrow">
            <a :href="`#/pack/${p.name}`" class="hover:text-fg">{{ p.name }}</a>
          </h2>
          <p class="text-[13px] text-faint">{{ p.summary }}</p>
        </div>

        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <article
            v-for="item in p.items"
            :key="item.name"
            class="group relative flex flex-col overflow-hidden rounded-[14px] border border-line transition-colors hover:border-chip"
          >
            <a :href="`#/item/${item.name}`" class="flex flex-auto items-start gap-3.5 p-4">
              <PackTile :pack="item.pack" :agent="item.kind === 'agent'" />
              <span class="flex min-w-0 flex-col gap-1">
                <span class="font-mono text-[15px] leading-snug font-medium text-fg">{{ item.name }}</span>
                <span class="line-clamp-3 text-[14px] leading-[1.6] text-muted">{{ shortDescription(item.description) }}</span>
                <span class="mt-1 font-mono text-xs text-faint">
                  {{ item.kind }} · {{ item.files.length }} files · {{ item.lines.toLocaleString('en-US') }} lines
                </span>
              </span>
            </a>
            <div class="flex items-center gap-2 border-t border-line bg-raised py-1 pr-2 pl-4">
              <code class="min-w-0 flex-auto truncate font-mono text-[12px] text-soft">install.sh {{ item.name }}{{ item.pack === 'tooling' ? ' --global' : '' }}</code>
              <CopyButton :text="installCommands(item)[0].text" :label="`the install command for ${item.name}`" />
            </div>
          </article>
        </div>
      </div>

      <div v-if="!visible.length && !hits.length" class="mt-10 rounded-xl border border-dashed border-line px-6 py-10 text-center">
        <p class="text-[15px] text-soft">Nothing matches “{{ query }}”.</p>
        <button type="button" class="link-underline mt-3 cursor-pointer text-sm" @click="(query = ''), (pack = ALL)">Clear the search</button>
      </div>

      <div v-if="hits.length" class="mt-14">
        <h2 class="eyebrow">Inside the files</h2>
        <div class="mt-4 flex flex-col divide-y divide-line rounded-[14px] border border-line">
          <a
            v-for="h in hits"
            :key="h.item.name + h.file.path"
            :href="`#/item/${h.item.name}/${h.file.path}`"
            class="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-raised"
          >
            <span class="font-mono text-xs text-faint">
              <span class="text-fg">{{ h.item.name }}</span> / {{ h.file.path }}
            </span>
            <span class="text-[14px] leading-[1.6] text-muted [overflow-wrap:anywhere]" dir="auto" v-html="highlight(h.snippet)" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
