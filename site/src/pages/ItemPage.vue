<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { computed, nextTick, watch } from 'vue';
import { type Item, mainFile } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import PackTile from '../components/PackTile.vue';
import { installCommands } from '../install';
import { renderCode, renderMarkdown } from '../markdown';

const props = defineProps<{ item: Item; path: string; anchor: string }>();

const file = computed(() => props.item.files.find(f => f.path === props.path) ?? mainFile(props.item));
const commands = computed(() => installCommands(props.item));

const groups = computed(() => {
  const map = new Map<string, Item['files']>();

  for (const f of props.item.files) {
    const dir = f.path.includes('/') ? f.path.split('/')[0] : 'root';
    map.set(dir, [...(map.get(dir) ?? []), f]);
  }

  return [...map.entries()];
});

const html = computed(() => {
  const f = file.value;

  if (f.content === null) return '';

  return f.path.endsWith('.md') ? renderMarkdown(f.content, props.item.name, f.path) : renderCode(f.content, f.path);
});

const svgSource = computed(() =>
  file.value.path.endsWith('.svg') && file.value.content ? `data:image/svg+xml;utf8,${encodeURIComponent(file.value.content)}` : '',
);

watch(
  () => [props.item.name, props.path, props.anchor],
  async ([name], old) => {
    await nextTick();

    if (props.anchor) {
      document.getElementById(props.anchor)?.scrollIntoView({ block: 'start' });
    } else if (old && old[0] === name) {
      document.getElementById('file')?.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <section class="pt-12 md:pt-16">
      <a href="#/" class="go link-muted inline-flex min-h-11 items-center gap-1.5 text-sm">
        <ArrowLeft class="size-4" />
        All skills
      </a>

      <div class="mt-6 flex items-start gap-4">
        <PackTile :pack="item.pack" :agent="item.kind === 'agent'" :size="48" />
        <div class="min-w-0">
          <p class="eyebrow">
            <a :href="`#/pack/${item.pack}`" class="hover:text-fg">{{ item.pack }}</a> · {{ item.kind }}
          </p>
          <h1 class="mt-1 font-mono text-[26px] leading-tight font-medium tracking-[-0.01em] [overflow-wrap:anywhere] md:text-[30px]">
            {{ item.name }}
          </h1>
        </div>
      </div>

      <p class="mt-6 text-[16px] leading-[1.7] text-soft">{{ item.description }}</p>
      <p class="mt-3 font-mono text-xs text-faint">
        {{ item.files.length }} files · {{ item.lines.toLocaleString('en-US') }} lines
      </p>
    </section>

    <section aria-labelledby="install" class="mt-10">
      <h2 id="install" class="eyebrow">Install</h2>
      <div class="mt-4 flex flex-col divide-y divide-line overflow-hidden rounded-[14px] border border-line">
        <div v-for="c in commands" :key="c.label" class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
          <span class="shrink-0 text-[13px] text-faint sm:w-56">{{ c.label }}</span>
          <div class="flex min-w-0 flex-auto items-center gap-2">
            <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-fg">{{ c.text }}</code>
            <CopyButton :text="c.text" :label="c.label" />
          </div>
        </div>
      </div>
    </section>

    <section id="file" aria-labelledby="files" class="mt-12 scroll-mt-6">
      <h2 id="files" class="eyebrow">Files</h2>
      <div class="mt-4 flex flex-col gap-3">
        <div v-for="[dir, files] in groups" :key="dir" class="flex flex-wrap items-center gap-2">
          <span class="w-20 shrink-0 font-mono text-[11.5px] text-faint">{{ dir === 'root' ? '/' : `${dir}/` }}</span>
          <a
            v-for="f in files"
            :key="f.path"
            :href="`#/item/${item.name}/${f.path}`"
            class="inline-flex min-h-8 items-center rounded-full px-3 font-mono text-[12px] transition-colors"
            :class="f.path === file.path ? 'border border-fg bg-surface text-fg' : 'border border-chip text-muted hover:text-fg'"
            :aria-current="f.path === file.path ? 'page' : undefined"
          >
            {{ f.path.split('/').pop() }}
            <span v-if="f.content !== null" class="ml-1.5 text-[10.5px] opacity-60">{{ f.lines }}</span>
          </a>
        </div>
      </div>

      <article class="mt-6 overflow-hidden rounded-[14px] border border-line">
        <header class="flex items-center justify-between gap-3 border-b border-line bg-raised py-1 pr-2 pl-4">
          <span class="truncate font-mono text-xs text-faint">{{ item.name }}/{{ file.path }}</span>
          <CopyButton v-if="file.content !== null" :text="file.content" :label="file.path" />
        </header>

        <img v-if="file.url || svgSource" :src="file.url ?? svgSource" :alt="file.path" class="mx-auto my-8 max-h-80 max-w-[80%]" />

        <div
          v-if="file.path.endsWith('.md')"
          class="prose-site prose max-w-none px-5 pt-1 pb-6 text-[15px] leading-[1.7] prose-headings:font-semibold prose-headings:tracking-[-0.01em] prose-headings:scroll-mt-6 prose-h1:text-[24px] prose-h2:text-[19px] prose-h3:text-[16px] prose-a:font-normal prose-a:underline-offset-4 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-line prose-table:text-[13.5px] md:px-7"
          v-html="html"
        />
        <div v-else-if="file.content !== null" class="overflow-x-auto bg-raised text-[12.5px] leading-[1.6] [&_pre]:m-0 [&_pre]:p-5" v-html="html" />
      </article>
    </section>
  </div>
</template>
