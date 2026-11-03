<script setup lang="ts">
import { Box, Brush, GitCommitHorizontal, Layers, LayoutTemplate, MessageCircle, Mountain, Package, Rocket, Signature, Sparkles } from 'lucide-vue-next';
import { computed } from 'vue';

const { tags, size = 36 } = defineProps<{ tags: string[]; size?: number }>();

const icons: Record<string, unknown> = {
  laravel: Layers,
  vue: LayoutTemplate,
  nuxt: Mountain,
  ui: Box,
  design: Brush,
  brand: Signature,
  deploy: Rocket,
  git: GitCommitHorizontal,
  whatsapp: MessageCircle,
  ai: Sparkles,
};

const icon = computed(() => icons[tags.find(t => t in icons) ?? ''] ?? Package);
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-line bg-raised text-mark"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <component :is="icon" :style="{ width: `${Math.round(size * 0.47)}px`, height: `${Math.round(size * 0.47)}px` }" />
  </span>
</template>
