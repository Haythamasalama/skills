<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { contact, links } from '../site';
import SignatureMark from './SignatureMark.vue';

defineProps<{ path: string }>();
</script>

<template>
  <header class="flex items-center justify-between gap-6 pt-4 md:pt-7">
    <a href="/" class="inline-flex min-h-11 items-center" aria-label="Skills, home">
      <!-- Keyed by page, so the signature draws itself again on every page. -->
      <SignatureMark :key="`m${path}`" class="md:hidden" :width="72" />
      <SignatureMark :key="`d${path}`" class="hidden md:block" :width="80" />
    </a>

    <nav aria-label="Links" class="flex items-center gap-x-5 text-sm">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.to"
        target="_blank"
        rel="noopener"
        class="link-muted hidden min-h-11 items-center sm:inline-flex"
      >
        {{ link.label }}
      </a>
      <a
        :href="contact.to"
        target="_blank"
        rel="noopener"
        class="inline-flex min-h-9 items-center gap-1 rounded-full border border-chip px-3.5 text-fg transition-colors hover:bg-surface"
      >
        {{ contact.label }} <ArrowUpRight class="size-3.5 text-faint" />
      </a>
    </nav>
  </header>
</template>
