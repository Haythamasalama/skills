<script setup lang="ts">
import { ArrowUpRight, ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';
import { publishers, recommended } from '../catalog';
import CopyButton from '../components/CopyButton.vue';

const open = ref(new Set<string>());

function toggle(key: string) {
  const next = new Set(open.value);
  next.has(key) ? next.delete(key) : next.add(key);
  open.value = next;
}

const restore = 'npx skills experimental_install';
</script>

<template>
  <div>
    <section class="pt-16 md:pt-[88px]">
      <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">Recommended</h1>
      <p class="mt-3 max-w-[60ch] text-[17px] leading-[1.7] text-soft">
        Skills from the people who build the tools, and a few from the community. They are listed in
        <code class="font-mono text-[15px] text-fg">skills-lock.json</code> and installed from their own source.
      </p>

      <div class="mt-6 flex max-w-2xl flex-col gap-1">
        <span class="text-[13px] text-faint">All of them: copy <code class="font-mono">skills-lock.json</code> into the project, then</span>
        <div class="flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
          <span class="font-mono text-[13px] text-faint select-none">$</span>
          <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ restore }}</code>
          <CopyButton :text="restore" label="the restore command" />
        </div>
      </div>
    </section>

    <section aria-label="Publishers" class="pt-14">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-line px-2 py-2 font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
        <span>Creator</span><span>Skills</span>
      </div>

      <div v-for="p in publishers" :key="p.owner + p.repo" class="border-b border-line">
        <button
          type="button"
          class="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg px-2 py-3 text-left transition-colors hover:bg-raised"
          :aria-expanded="open.has(p.owner + p.repo)"
          @click="toggle(p.owner + p.repo)"
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
            <ChevronDown class="size-4 text-faint transition-transform" :class="open.has(p.owner + p.repo) && 'rotate-180'" />
          </span>
        </button>

        <div v-if="open.has(p.owner + p.repo)" class="flex flex-col gap-2 px-2 pb-4 pl-[3.25rem]">
          <div v-for="s in p.skills" :key="s.name" class="flex flex-col gap-1">
            <span class="font-mono text-[13.5px] text-fg">{{ s.name }}</span>
            <div class="flex min-w-0 items-center gap-2 rounded-lg border border-line py-0.5 pr-1 pl-3">
              <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[12px] whitespace-nowrap text-soft">{{ s.command }}</code>
              <CopyButton :text="s.command" :label="`the install command for ${s.name}`" />
            </div>
          </div>
          <a :href="p.url" target="_blank" rel="noopener" class="link-muted mt-1 inline-flex items-center gap-1 text-xs">
            Source <ArrowUpRight class="size-3.5" />
          </a>
        </div>
      </div>

      <p class="mt-4 px-2 text-[13px] text-faint">{{ recommended.length }} skills from {{ publishers.length }} sources.</p>
    </section>
  </div>
</template>
