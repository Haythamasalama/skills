<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { allItems, allTags, search } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import SkillsNav from '../components/SkillsNav.vue';
import { installCommands, REPO } from '../install';

const ALL = 'All';
const tag = ref(ALL);
const query = ref('');
const box = ref<HTMLInputElement>();

const tabs = computed(() => [{ label: ALL, count: allItems.length }, ...allTags.map(t => ({ label: t.tag, count: t.count }))]);

const terms = computed(() => query.value.toLowerCase().split(/\s+/).filter(Boolean));

const rows = computed(() =>
  allItems
    .filter(item => tag.value === ALL || item.tags.includes(tag.value))
    .filter(item => terms.value.every(t => `${item.name} ${item.tags.join(' ')} ${item.description}`.toLowerCase().includes(t))),
);

const hits = computed(() => (terms.value.length ? search(query.value, 8) : []));

const summary = (text: string) => text.replace(/^Use when /, '').replace(/\s+—.*$/, '').replace(/^./, c => c.toUpperCase());

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

const tryIt = `npx skills add ${REPO}`;
</script>

<template>
  <div>
    <section class="pt-16 md:pt-[88px]">
      <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">Skills</h1>
      <SkillsNav current="skills" />
      <p class="mt-3 max-w-[60ch] text-[17px] leading-[1.7] text-soft">
        Playbooks for Claude Code, each one standalone. Install one, or pick from the list, with the standard skills CLI.
      </p>

      <div class="mt-6 flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
        <span class="font-mono text-[13px] text-faint select-none">$</span>
        <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ tryIt }}</code>
        <CopyButton :text="tryIt" label="the install command" />
      </div>
    </section>

    <section aria-label="All skills" class="pt-14">
      <h2 class="eyebrow">All skills</h2>
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

      <div role="tablist" aria-label="Technologies" class="mt-4 flex gap-1 overflow-x-auto border-b border-line">
        <button
          v-for="t in tabs"
          :key="t.label"
          type="button"
          role="tab"
          :aria-selected="tag === t.label"
          class="-mb-px shrink-0 cursor-pointer border-b px-3 py-2 text-[13px] transition-colors"
          :class="tag === t.label ? 'border-fg text-fg' : 'border-transparent text-muted hover:text-fg'"
          @click="tag = t.label"
        >
          {{ t.label }} <span class="font-mono text-[11px] text-faint">{{ t.count }}</span>
        </button>
      </div>

      <div class="mt-2">
        <div class="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 px-2 py-2 font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
          <span>#</span><span>Skill</span><span class="text-right">Install</span>
        </div>

        <a
          v-for="(item, i) in rows"
          :key="item.name"
          :href="`#/item/${item.name}`"
          class="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-raised"
        >
          <span class="font-mono text-[13px] text-faint">{{ i + 1 }}</span>
          <span class="flex min-w-0 flex-col">
            <span class="font-mono text-[15px] font-medium text-fg">{{ item.name }}</span>
            <span class="truncate text-[13px] text-faint">
              <span class="font-mono">{{ item.tags.join(' · ') }}</span> — {{ summary(item.description) }}
            </span>
          </span>
          <span @click.prevent.stop>
            <CopyButton :text="installCommands(item)[0].text" :label="`the install command for ${item.name}`" />
          </span>
        </a>

        <p v-if="!rows.length && !hits.length" class="px-2 py-10 text-center text-[15px] text-muted">
          Nothing matches “{{ query }}”.
        </p>
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
