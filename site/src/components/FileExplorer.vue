<script setup lang="ts">
import { ChevronRight, FileCode, FileImage, FileText, Folder, FolderOpen, House } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import type { Item, RepoFile } from '../catalog';

const props = defineProps<{ item: Item; current: string }>();

const FOLDER_LABELS: Record<string, string> = {
  references: 'References',
  scripts: 'Scripts',
  assets: 'Assets',
  evals: 'Evals',
};

const tree = computed(() => {
  const root: RepoFile[] = [];
  const folders = new Map<string, RepoFile[]>();

  for (const f of props.item.files) {
    if (!f.path.includes('/')) {
      root.push(f);
      continue;
    }

    const dir = f.path.split('/')[0];
    folders.set(dir, [...(folders.get(dir) ?? []), f]);
  }

  return { root, folders: [...folders.entries()] };
});

const closed = ref(new Set<string>());

function toggle(dir: string) {
  const next = new Set(closed.value);
  next.has(dir) ? next.delete(dir) : next.add(dir);
  closed.value = next;
}

const iconFor = (f: RepoFile) => (f.path === 'SKILL.md' ? House : f.path.endsWith('.md') ? FileText : f.url || f.path.endsWith('.svg') ? FileImage : FileCode);
const nameIn = (f: RepoFile) => f.path.split('/').slice(1).join('/') || f.path;
</script>

<template>
  <nav aria-label="Files in this skill" class="flex flex-col gap-1 text-[13px]">
    <a
      v-for="f in tree.root"
      :key="f.path"
      :href="`#/item/${item.name}/${f.path}`"
      class="group flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors"
      :class="f.path === current ? 'bg-surface text-fg' : 'text-muted hover:bg-raised hover:text-fg'"
      :aria-current="f.path === current ? 'page' : undefined"
    >
      <component :is="iconFor(f)" class="mt-0.5 size-4 shrink-0" />
      <span class="flex min-w-0 flex-col">
        <span class="leading-snug">{{ f.title }}</span>
        <span class="truncate font-mono text-[11px] text-faint">{{ f.path }}</span>
      </span>
    </a>

    <div v-for="[dir, files] in tree.folders" :key="dir" class="mt-2">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-faint transition-colors hover:text-fg"
        :aria-expanded="!closed.has(dir)"
        @click="toggle(dir)"
      >
        <ChevronRight class="size-3.5 shrink-0 transition-transform" :class="!closed.has(dir) && 'rotate-90'" />
        <component :is="closed.has(dir) ? Folder : FolderOpen" class="size-4 shrink-0" />
        <span class="eyebrow !text-[11px]">{{ FOLDER_LABELS[dir] ?? dir }}</span>
        <span class="ml-auto font-mono text-[11px]">{{ files.length }}</span>
      </button>

      <div v-if="!closed.has(dir)" class="ml-[17px] flex flex-col gap-0.5 border-l border-line pl-2">
        <a
          v-for="f in files"
          :key="f.path"
          :href="`#/item/${item.name}/${f.path}`"
          class="flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors"
          :class="f.path === current ? 'bg-surface text-fg' : 'text-muted hover:bg-raised hover:text-fg'"
          :aria-current="f.path === current ? 'page' : undefined"
        >
          <component :is="iconFor(f)" class="mt-0.5 size-4 shrink-0" />
          <span class="flex min-w-0 flex-col">
            <span class="leading-snug">{{ f.title }}</span>
            <span class="truncate font-mono text-[11px] text-faint">{{ nameIn(f) }}</span>
          </span>
        </a>
      </div>
    </div>
  </nav>
</template>
