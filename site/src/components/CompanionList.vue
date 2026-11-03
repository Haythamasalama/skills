<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import type { Companion } from '../catalog';
import CopyButton from './CopyButton.vue';

defineProps<{ companions: Companion[] }>();
</script>

<template>
  <div class="flex flex-col divide-y divide-line overflow-hidden rounded-[14px] border border-line">
    <div v-for="c in companions" :key="c.name" class="flex flex-col gap-1.5 px-4 py-3">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span class="font-mono text-[14px] font-medium text-fg">{{ c.name }}</span>
        <span
          class="rounded-[5px] px-1.5 font-mono text-[9.5px] leading-4 tracking-[0.1em] uppercase"
          :class="c.kind === 'official' ? 'border-gradient' : 'border border-chip text-faint'"
        >
          <span :class="c.kind === 'official' && 'text-gradient'">{{ c.kind }}</span>
        </span>
        <a
          v-if="c.url"
          :href="c.url"
          target="_blank"
          rel="noopener"
          class="link-muted ml-auto inline-flex items-center gap-1 text-xs"
        >
          Docs <ArrowUpRight class="size-3.5" />
        </a>
      </div>
      <p class="text-[13.5px] leading-[1.6] text-muted">{{ c.what }}</p>
      <div class="flex min-w-0 items-center gap-2">
        <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-soft">{{ c.command }}</code>
        <CopyButton :text="c.command" :label="`the install command for ${c.name}`" />
      </div>
    </div>
  </div>
</template>
