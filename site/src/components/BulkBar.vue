<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed } from 'vue';
import { bulkCommands } from '../install';
import { picks } from '../picks';
import CopyButton from './CopyButton.vue';

const commands = computed(() => bulkCommands([...picks.values()]));
// One line per source, broken only between arguments, so a name like apple-macos-27-design stays whole.
const lines = computed(() => commands.value.map((c, i) => (i < commands.value.length - 1 ? `${c} &&` : c).split(' ')));
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
    leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
    enter-from-class="translate-y-4 opacity-0"
    leave-to-class="translate-y-4 opacity-0"
  >
    <section v-if="picks.size" aria-label="Selected skills" class="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 md:px-6">
      <div class="mx-auto max-w-[992px] rounded-[16px] border border-chip bg-raised p-3 shadow-[0_10px_36px_rgb(0_0_0/0.25)]">
        <div class="flex items-center justify-between gap-3 pl-1">
          <p class="text-[13px] text-muted">
            <span class="font-medium text-fg">{{ picks.size }}</span> selected. Copy once to install them all.
          </p>
          <div class="flex items-center gap-1">
            <CopyButton :text="commands.join(' && ')" label="the install command for the selected skills" />
            <button
              type="button"
              class="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs text-muted transition-colors hover:bg-surface hover:text-fg"
              @click="picks.clear()"
            >
              <X class="size-3.5" /> Clear
            </button>
          </div>
        </div>
        <code class="mt-2 block max-h-28 overflow-y-auto rounded-[10px] border border-line bg-bg px-3 py-2 font-mono text-[12.5px] leading-[1.7] text-fg">
          <span v-for="(words, i) in lines" :key="i" class="block">
            <template v-for="(word, j) in words" :key="j"><span class="whitespace-nowrap">{{ word }}</span>{{ ' ' }}</template>
          </span>
        </code>
      </div>
    </section>
  </Transition>
</template>
