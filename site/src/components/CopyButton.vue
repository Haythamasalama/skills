<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next';
import { onBeforeUnmount, ref } from 'vue';

const { text, label = 'command' } = defineProps<{
  text: string;
  /** What is being copied, read out by screen readers. */
  label?: string;
}>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1600);
  } catch {
    // Clipboard access can be blocked (an insecure context); fail quietly.
  }
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <button
    type="button"
    class="inline-flex min-h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-surface hover:text-fg"
    :aria-label="copied ? `Copied ${label}` : `Copy ${label}`"
    @click="copy"
  >
    <component :is="copied ? Check : Copy" class="size-3.5" :class="{ 'text-accent-2': copied }" />
    <span :class="{ 'text-gradient': copied }">{{ copied ? 'Copied' : 'Copy' }}</span>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </button>
</template>
