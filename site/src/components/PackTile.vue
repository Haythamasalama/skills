<script setup lang="ts">
import {
  Bot,
  GitCommitHorizontal,
  Layers,
  LayoutTemplate,
  MessageCircle,
  Mountain,
  Package,
  PenLine,
  Rocket,
  Signature,
  Wrench,
} from 'lucide-vue-next';
import { computed } from 'vue';

const { pack, agent = false, size = 36 } = defineProps<{ pack: string; agent?: boolean; size?: number }>();

const icons: Record<string, unknown> = {
  laravel: Layers,
  'vue-inertia': LayoutTemplate,
  'nuxt-ui': Mountain,
  brand: Signature,
  writing: PenLine,
  deploy: Rocket,
  git: GitCommitHorizontal,
  whatsapp: MessageCircle,
  tooling: Wrench,
};

const icon = computed(() => (agent ? Bot : icons[pack] ?? Package));
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
