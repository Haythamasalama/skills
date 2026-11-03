<script setup lang="ts">
defineProps<{ current: 'skills' | 'recommended' }>();

const links = [
  { id: 'skills', label: 'My skills', to: '#/' },
  { id: 'recommended', label: 'Recommended', to: '#/recommended' },
] as const;
</script>

<template>
  <nav aria-label="Skills sections" class="mt-6 inline-flex rounded-full border border-line p-1">
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.to"
      class="inline-flex min-h-8 items-center rounded-full px-3.5 text-[13px] transition-colors"
      :class="current === link.id ? 'bg-surface text-fg' : 'text-muted hover:text-fg'"
      :aria-current="current === link.id ? 'page' : undefined"
    >
      {{ link.label }}
    </a>
  </nav>
</template>
