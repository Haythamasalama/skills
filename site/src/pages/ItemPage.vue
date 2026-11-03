<script setup lang="ts">
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { type Item, mainFile } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import FileExplorer from '../components/FileExplorer.vue';
import TagTile from '../components/TagTile.vue';
import { installCommands } from '../install';
import { renderCode, renderMarkdown } from '../markdown';

const props = defineProps<{ item: Item; path: string; anchor: string }>();

const file = computed(() => props.item.files.find(f => f.path === props.path) ?? mainFile(props.item));
const index = computed(() => props.item.files.indexOf(file.value));
const previous = computed(() => props.item.files[index.value - 1]);
const next = computed(() => props.item.files[index.value + 1]);
const commands = computed(() => installCommands(props.item));
const showAll = ref(false);

const crumbs = computed(() => file.value.path.split('/'));

const html = computed(() => {
  const f = file.value;

  if (f.content === null) return '';

  return f.path.endsWith('.md') ? renderMarkdown(f.content, props.item.name, f.path) : renderCode(f.content, f.path);
});

const svgSource = computed(() =>
  file.value.path.endsWith('.svg') && file.value.content ? `data:image/svg+xml;utf8,${encodeURIComponent(file.value.content)}` : '',
);

function go(path: string) {
  location.hash = `#/item/${props.item.name}/${path}`;
}

watch(
  () => [props.item.name, props.path, props.anchor],
  async ([name], old) => {
    await nextTick();

    if (props.anchor) {
      document.getElementById(props.anchor)?.scrollIntoView({ block: 'start' });
    } else if (old && old[0] === name) {
      document.getElementById('reader')?.scrollIntoView({ block: 'start' });
    } else {
      showAll.value = false;
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
        <TagTile :tags="item.tags" :size="48" />
        <div class="min-w-0">
          <p class="eyebrow">
            {{ item.tags.join(' · ') }} ·
            {{ item.files.length }} files · {{ item.lines.toLocaleString('en-US') }} lines
          </p>
          <h1 class="mt-1 font-mono text-[26px] leading-tight font-medium tracking-[-0.01em] [overflow-wrap:anywhere] md:text-[30px]">
            {{ item.name }}
          </h1>
        </div>
      </div>

      <p class="mt-6 text-[16px] leading-[1.7] text-soft" :class="!showAll && 'line-clamp-3'">{{ item.description }}</p>
      <button type="button" class="link-muted mt-1 inline-flex min-h-9 cursor-pointer items-center gap-1 text-[13px]" @click="showAll = !showAll">
        {{ showAll ? 'Show less' : 'Show the full description' }}
        <ChevronDown class="size-3.5 transition-transform" :class="showAll && 'rotate-180'" />
      </button>

      <div class="mt-6 flex flex-col divide-y divide-line overflow-hidden rounded-[14px] border border-line">
        <div v-for="c in commands" :key="c.label" class="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4">
          <span class="shrink-0 text-[13px] text-faint sm:w-56">{{ c.label }}</span>
          <div class="flex min-w-0 flex-auto items-center gap-2">
            <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-fg">{{ c.text }}</code>
            <CopyButton :text="c.text" :label="c.label" />
          </div>
        </div>
      </div>
    </section>


    <section id="reader" aria-label="Files" class="mt-12 grid scroll-mt-4 gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
      <aside class="hidden md:block">
        <div class="sticky top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto pr-1">
          <p class="eyebrow mb-3 px-2.5">Files</p>
          <FileExplorer :item="item" :current="file.path" />
        </div>
      </aside>

      <label class="md:hidden">
        <span class="eyebrow mb-2 block">File</span>
        <select
          class="min-h-11 w-full rounded-lg border border-chip bg-bg px-3 font-mono text-[13px] text-fg"
          :value="file.path"
          @change="go(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="f in item.files" :key="f.path" :value="f.path">{{ f.path }} · {{ f.title }}</option>
        </select>
      </label>

      <article class="min-w-0">
        <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p class="flex min-w-0 flex-wrap items-center gap-1 font-mono text-xs text-faint">
            <a :href="`#/item/${item.name}`" class="hover:text-fg">{{ item.name }}</a>
            <template v-for="(part, i) in crumbs" :key="i">
              <span aria-hidden="true">/</span>
              <span :class="i === crumbs.length - 1 && 'text-fg'">{{ part }}</span>
            </template>
          </p>
          <span class="flex items-center gap-2 font-mono text-xs text-faint">
            <span v-if="file.content !== null">{{ file.lines }} lines</span>
            <CopyButton v-if="file.content !== null" :text="file.content" :label="file.path" />
          </span>
        </header>

        <div class="mt-3 overflow-hidden rounded-[14px] border border-line">
          <img v-if="file.url || svgSource" :src="file.url ?? svgSource" :alt="file.path" class="mx-auto my-8 max-h-80 max-w-[80%]" />

          <div
            v-if="file.path.endsWith('.md')"
            class="prose-site prose max-w-none px-5 pt-1 pb-6 text-[15px] leading-[1.7] prose-headings:font-semibold prose-headings:tracking-[-0.01em] prose-headings:scroll-mt-6 prose-h1:text-[24px] prose-h2:text-[19px] prose-h3:text-[16px] prose-a:font-normal prose-a:underline-offset-4 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-line prose-table:text-[13.5px] md:px-7"
            v-html="html"
          />
          <div v-else-if="file.content !== null" class="overflow-x-auto bg-raised text-[12.5px] leading-[1.6] [&_pre]:m-0 [&_pre]:p-5" v-html="html" />
        </div>

        <nav aria-label="Previous and next file" class="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            v-if="previous"
            :href="`#/item/${item.name}/${previous.path}`"
            class="flex flex-col gap-0.5 rounded-[14px] border border-line px-4 py-3 transition-colors hover:border-chip hover:bg-raised"
          >
            <span class="inline-flex items-center gap-1 text-xs text-faint"><ArrowLeft class="size-3.5" /> Previous</span>
            <span class="text-[14px] text-fg">{{ previous.title }}</span>
            <span class="truncate font-mono text-[11px] text-faint">{{ previous.path }}</span>
          </a>
          <span v-else />
          <a
            v-if="next"
            :href="`#/item/${item.name}/${next.path}`"
            class="flex flex-col items-end gap-0.5 rounded-[14px] border border-line px-4 py-3 text-right transition-colors hover:border-chip hover:bg-raised"
          >
            <span class="inline-flex items-center gap-1 text-xs text-faint">Next <ArrowRight class="size-3.5" /></span>
            <span class="text-[14px] text-fg">{{ next.title }}</span>
            <span class="max-w-full truncate font-mono text-[11px] text-faint">{{ next.path }}</span>
          </a>
        </nav>
      </article>
    </section>
  </div>
</template>
