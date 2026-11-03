<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ text: string; label?: string }>();
const copied = ref(false);

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text);
  } catch {
    const area = document.createElement('textarea');
    area.value = props.text;
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  copied.value = true;
  setTimeout(() => (copied.value = false), 1400);
}
</script>

<template>
  <button type="button" class="copy" :class="{ done: copied }" @click="copy">
    {{ copied ? 'تم النسخ ✓' : (label ?? 'نسخ') }}
  </button>
</template>
