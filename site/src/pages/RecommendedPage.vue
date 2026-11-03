<script setup lang="ts">
import { ArrowUpRight, ChevronDown, X } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { type Publisher, publishers, type Recommended, recommended } from '../catalog';
import CopyButton from '../components/CopyButton.vue';

const ALL_COMMAND = 'npx skills experimental_install';

const open = ref<string | null>(null);
const selected = ref<Recommended | null>(null);

const key = (p: Publisher) => `${p.owner}/${p.repo}`;

function choosePublisher(p: Publisher) {
  const k = key(p);
  open.value = open.value === k ? null : k;
  selected.value = open.value ? p.skills[0] : null;
}

const command = computed(() => selected.value?.command ?? ALL_COMMAND);
const label = computed(() =>
  selected.value ? `${selected.value.name} · ${selected.value.source}` : 'All of them: copy skills-lock.json into the project, then',
);
</script>

<template>
  <div>
    <section class="pt-16 md:pt-[88px]">
      <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">Recommended</h1>
      <p class="mt-3 max-w-[60ch] text-[17px] leading-[1.7] text-soft">
        Skills from the people who build the tools, and a few from the community. They are listed in
        <code class="font-mono text-[15px] text-fg">skills-lock.json</code> and installed from their own source.
      </p>
    </section>

    <div class="sticky top-0 z-10 -mx-6 mt-6 bg-bg/90 px-6 py-3 backdrop-blur">
      <div class="flex items-center justify-between gap-3">
        <span class="truncate font-mono text-[12.5px]" :class="selected ? 'text-fg' : 'text-faint'">{{ label }}</span>
        <button
          v-if="selected"
          type="button"
          class="link-muted inline-flex shrink-0 cursor-pointer items-center gap-1 text-[12px]"
          @click="(selected = null), (open = null)"
        >
          <X class="size-3.5" /> All
        </button>
      </div>
      <div class="mt-1.5 flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
        <span class="font-mono text-[13px] text-faint select-none">$</span>
        <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ command }}</code>
        <CopyButton :text="command" label="the install command" />
      </div>
    </div>

    <section aria-label="Sources" class="pt-8">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-line px-2 py-2 font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
        <span>Creator</span><span>Skills</span>
      </div>

      <div v-for="p in publishers" :key="key(p)" class="border-b border-line">
        <button
          type="button"
          class="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-2 py-3 text-left transition-colors hover:bg-raised"
          :class="open === key(p) && 'bg-raised'"
          :aria-expanded="open === key(p)"
          @click="choosePublisher(p)"
        >
          <span class="flex min-w-0 items-center gap-3">
            <img v-if="p.avatar" :src="p.avatar" alt="" width="32" height="32" class="avatar-mono size-8 shrink-0 rounded-lg" loading="lazy" />
            <span v-else class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-line font-mono text-[13px] text-mark">
              {{ p.owner.slice(0, 1).toUpperCase() }}
            </span>
            <span class="truncate font-mono text-[14px]">
              <span class="text-fg">{{ p.owner }}</span>
              <span v-if="p.repo" class="text-faint"> / {{ p.repo }}</span>
            </span>
          </span>
          <span class="flex items-center gap-2 font-mono text-[13px] text-muted">
            {{ p.skills.length }}
            <ChevronDown class="size-4 text-faint transition-transform" :class="open === key(p) && 'rotate-180'" />
          </span>
        </button>

        <div v-if="open === key(p)" class="flex flex-wrap items-center gap-2 px-2 pt-1 pb-4 pl-[3.25rem]">
          <button
            v-for="s in p.skills"
            :key="s.name"
            type="button"
            class="inline-flex min-h-8 cursor-pointer items-center rounded-full px-3 font-mono text-[12.5px] transition-colors"
            :class="selected?.name === s.name ? 'border border-fg bg-surface text-fg' : 'border border-chip text-muted hover:text-fg'"
            :aria-pressed="selected?.name === s.name"
            @click="selected = s"
          >
            {{ s.name }}
          </button>
          <a :href="p.url" target="_blank" rel="noopener" class="link-muted ml-auto inline-flex items-center gap-1 text-xs">
            Source <ArrowUpRight class="size-3.5" />
          </a>
        </div>
      </div>

      <p class="mt-4 px-2 text-[13px] text-faint">{{ recommended.length }} skills from {{ publishers.length }} sources.</p>
    </section>
  </div>
</template>
