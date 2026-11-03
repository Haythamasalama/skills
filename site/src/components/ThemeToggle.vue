<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const isDark = ref(document.documentElement.classList.contains('dark'));
const label = computed(() => (isDark.value ? 'Switch to light theme' : 'Switch to dark theme'));

function toggle() {
  isDark.value = !isDark.value;
  document.documentElement.className = isDark.value ? 'dark' : 'light';

  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  } catch {}
}
</script>

<template>
  <button
    type="button"
    class="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <component :is="isDark ? Sun : Moon" class="size-[18px]" />
  </button>
</template>
