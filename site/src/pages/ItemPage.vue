<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { type Item, mainFile, repoPath } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import { REPO } from '../install';
import { renderCode, renderMarkdown } from '../markdown';

const props = defineProps<{ item: Item; path: string; anchor: string }>();

const file = computed(() => props.item.files.find(f => f.path === props.path) ?? mainFile(props.item));
const isMain = computed(() => file.value.path === 'SKILL.md');

// The description split into short points: the trigger phrases are dropped, the first sentence says when to use it.
const summary = computed(() => {
  const text = props.item.description.split(/\s(?:Also triggers|Triggers|Arabic triggers)\b/)[0].trim();
  const sentences = text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
  const points = sentences.map((sentence, i) =>
    i === 0 && /^Use when /.test(sentence) ? `Use it when ${sentence.slice(9)}` : sentence,
  );

  return { lead: props.item.summary, points };
});

const [owner, repoName] = REPO.split('/');

const tabs = computed(() => [
  { label: 'Command', text: `npx skills add ${REPO} --skill ${props.item.name}` },
  { label: 'Prompt', text: `Install the ${props.item.name} skill from ${REPO} in this project` },
  // The local path only means something on the owner's machine, so the public build leaves it out.
  ...(import.meta.env.DEV ? [{ label: 'Local', text: `npx skills add ${repoPath} --skill ${props.item.name}` }] : []),
]);
const tab = ref(0);

const expanded = ref(false);
const long = computed(() => isMain.value && file.value.lines > 60);

const html = computed(() => {
  const f = file.value;

  if (f.content === null) return '';

  return f.path.endsWith('.md') ? renderMarkdown(f.content, props.item.name, f.path) : renderCode(f.content, f.path);
});

const svgSource = computed(() =>
  file.value.path.endsWith('.svg') && file.value.content ? `data:image/svg+xml;utf8,${encodeURIComponent(file.value.content)}` : '',
);

const groups = computed(() => {
  const map = new Map<string, Item['files']>();

  for (const f of props.item.files) {
    const dir = f.path.includes('/') ? f.path.split('/')[0] : '';
    map.set(dir, [...(map.get(dir) ?? []), f]);
  }

  return [...map.entries()];
});

watch(
  () => [props.item.name, props.path, props.anchor],
  async ([name], old) => {
    expanded.value = !!props.anchor;
    await nextTick();

    if (props.anchor) {
      document.getElementById(props.anchor)?.scrollIntoView({ block: 'start' });
    } else if (old && old[0] === name) {
      document.getElementById('content')?.scrollIntoView({ block: 'start' });
    } else {
      tab.value = 0;
      window.scrollTo({ top: 0 });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="pt-12 md:pt-16">
    <nav aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13.5px]">
        <li><a href="/" class="link-muted">skills</a></li>
        <li aria-hidden="true" class="text-chip">/</li>
        <li><a :href="`https://github.com/${owner}`" target="_blank" rel="noopener" class="link-muted">{{ owner }}</a></li>
        <li aria-hidden="true" class="text-chip">/</li>
        <li><a href="/" class="link-muted">{{ repoName }}</a></li>
        <li aria-hidden="true" class="text-chip">/</li>
        <li>
          <a v-if="!isMain" :href="`/skills/${item.name}`" class="link-muted">{{ item.name }}</a>
          <span v-else class="text-fg" aria-current="page">{{ item.name }}</span>
        </li>
        <template v-if="!isMain">
          <li aria-hidden="true" class="text-chip">/</li>
          <li class="text-fg" aria-current="page">{{ file.path }}</li>
        </template>
      </ol>
    </nav>

    <h1 class="mt-4 font-mono text-[26px] leading-tight font-medium tracking-[-0.01em] [overflow-wrap:anywhere] md:text-[32px]">
      {{ item.name }}
    </h1>

    <div class="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
      <div class="min-w-0">
        <section aria-labelledby="installation">
          <div class="flex items-center justify-between gap-3">
            <h2 id="installation" class="eyebrow">Installation</h2>
            <div role="tablist" aria-label="Install with" class="flex gap-1">
              <button
                v-for="(t, i) in tabs"
                :key="t.label"
                type="button"
                role="tab"
                :aria-selected="tab === i"
                class="cursor-pointer rounded-md px-2.5 py-1 text-[12px] transition-colors"
                :class="tab === i ? 'bg-surface text-fg' : 'text-muted hover:text-fg'"
                @click="tab = i"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2 rounded-[14px] border border-line bg-raised py-1 pr-2 pl-4">
            <span v-if="tab !== 1" class="font-mono text-[13px] text-faint select-none">$</span>
            <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[13px] whitespace-nowrap text-fg">{{ tabs[tab].text }}</code>
            <CopyButton :text="tabs[tab].text" :label="tabs[tab].label" />
          </div>
        </section>

        <section v-if="isMain && (summary.lead || summary.points.length)" aria-labelledby="summary" class="mt-10">
          <h2 id="summary" class="eyebrow">Summary</h2>
          <p v-if="summary.lead" class="mt-3 text-[17px] leading-[1.6] font-medium text-fg">{{ summary.lead }}</p>
          <ul class="mt-4 flex max-w-[75ch] flex-col gap-2.5 text-[15px] leading-[1.7] text-soft">
            <li v-for="(point, i) in summary.points" :key="i" class="flex gap-3">
              <span class="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-chip" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </section>

        <section id="content" aria-label="Skill content" class="mt-10 scroll-mt-6">
          <div class="flex items-center justify-between gap-3">
            <p class="flex min-w-0 items-center gap-2">
              <a v-if="!isMain" :href="`/skills/${item.name}`" class="link-muted inline-flex shrink-0 items-center gap-1 text-[13px]">
                <ArrowLeft class="size-3.5" /> Back to SKILL.md
              </a>
              <span v-else class="eyebrow">SKILL.md</span>
            </p>
            <CopyButton v-if="file.content !== null" :text="file.content" :label="file.path" />
          </div>

          <div class="relative mt-3 overflow-hidden rounded-[14px] border border-line" :class="long && !expanded && 'max-h-[34rem]'">
            <img v-if="file.url || svgSource" :src="file.url ?? svgSource" :alt="file.path" class="mx-auto my-8 max-h-80 max-w-[80%]" />
            <div
              v-if="file.path.endsWith('.md')"
              class="prose-site prose max-w-none p-6 md:p-8 [&>:first-child]:mt-0 [&>:last-child]:mb-0 text-[15px] leading-[1.7] prose-headings:font-semibold prose-headings:tracking-[-0.01em] prose-headings:scroll-mt-6 prose-h1:text-[24px] prose-h2:text-[19px] prose-h3:text-[16px] prose-a:font-normal prose-a:underline-offset-4 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-line prose-table:text-[13.5px]"
              v-html="html"
            />
            <div v-else-if="file.content !== null" class="overflow-x-auto bg-raised text-[12.5px] leading-[1.6] [&_pre]:m-0 [&_pre]:p-5" v-html="html" />
            <div v-if="long && !expanded" class="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-bg to-transparent" />
          </div>
          <button
            v-if="long"
            type="button"
            class="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[14px] border border-line text-[13px] text-muted transition-colors hover:bg-surface hover:text-fg"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
          >
            {{ expanded ? 'Show less' : 'Show more' }}
            <ChevronDown class="size-3.5 transition-transform" :class="expanded && 'rotate-180'" />
          </button>
        </section>
      </div>

      <aside class="flex flex-col gap-8 text-[13px] md:sticky md:top-6 md:self-start">
        <dl class="flex flex-col divide-y divide-line border-y border-line">
          <div class="flex flex-col gap-1 py-3">
            <dt class="text-[13px] text-faint">Repository</dt>
            <dd>
              <a
                :href="`https://github.com/${REPO}/tree/main/skills/${item.name}`"
                target="_blank"
                rel="noopener"
                class="link inline-flex items-center gap-1 font-mono text-[14px]"
              >{{ REPO }} <ArrowUpRight class="size-3.5 text-faint" /></a>
            </dd>
          </div>
          <div class="flex flex-col gap-1 py-3">
            <dt class="text-[13px] text-faint">Files</dt>
            <dd class="font-mono text-[15px] text-fg">{{ item.files.length }}</dd>
          </div>
          <div class="flex flex-col gap-1 py-3">
            <dt class="text-[13px] text-faint">Lines</dt>
            <dd class="font-mono text-[15px] text-fg">{{ item.lines.toLocaleString('en-US') }}</dd>
          </div>
          <div class="flex flex-col gap-2 py-3">
            <dt class="text-[13px] text-faint">Tags</dt>
            <dd class="flex flex-wrap gap-1.5">
              <span v-for="t in item.tags" :key="t" class="rounded-full border border-chip px-2.5 py-0.5 font-mono text-[11.5px] text-muted">{{ t }}</span>
            </dd>
          </div>
        </dl>

        <div>
          <p class="text-[13px] text-faint">Files</p>
          <div class="mt-2 flex flex-col gap-3">
            <div v-for="[dir, files] in groups" :key="dir" class="flex flex-col">
              <span v-if="dir" class="mb-1 font-mono text-[11px] text-faint">{{ dir }}/</span>
              <a
                v-for="f in files"
                :key="f.path"
                :href="`/skills/${item.name}/${f.path}`"
                class="truncate rounded-md px-2 py-1 font-mono text-[12px] transition-colors"
                :class="f.path === file.path ? 'bg-surface text-fg' : 'text-muted hover:text-fg'"
                :title="f.title"
              >{{ f.path.split('/').pop() }}</a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
