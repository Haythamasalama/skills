<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import { type Item, mainFile, repoPath } from './catalog';
import CopyButton from './CopyButton.vue';
import { renderCode, renderMarkdown } from './markdown';

const props = defineProps<{ item: Item; path: string; anchor: string }>();

const file = computed(() => props.item.files.find(f => f.path === props.path) ?? mainFile(props.item));
const global = computed(() => props.item.pack === 'tooling');

const commands = computed(() => {
  const script = `sh ${repoPath}/scripts/install.sh`;
  const target = global.value ? ' --global' : '';

  return [
    { label: global.value ? 'على الجهاز كله' : 'هالمهارة بس، جوا مجلد المشروع', text: `${script} ${props.item.name}${target}` },
    { label: `الحزمة كلها (${props.item.pack})`, text: `${script} ${props.item.pack}${target}` },
    { label: 'اطلبها من Claude بأي مشروع', text: `نزّل ${props.item.kind === 'agent' ? 'الوكيل' : 'مهارة'} ${props.item.name} بهالمشروع` },
  ];
});

const html = computed(() => {
  const f = file.value;

  if (f.content === null) return '';

  return f.path.endsWith('.md') ? renderMarkdown(f.content, props.item.name, f.path) : renderCode(f.content, f.path);
});

const groups = computed(() => {
  const map = new Map<string, typeof props.item.files>();

  for (const f of props.item.files) {
    const dir = f.path.includes('/') ? f.path.split('/')[0] : '';
    map.set(dir, [...(map.get(dir) ?? []), f]);
  }

  return [...map.entries()];
});

const label = (path: string) => path.split('/').pop();

watch(
  () => [props.path, props.anchor],
  async () => {
    await nextTick();

    if (props.anchor) {
      document.getElementById(props.anchor)?.scrollIntoView({ block: 'start' });
    } else {
      document.querySelector('.doc')?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    }
  },
  { immediate: true },
);
</script>

<template>
  <article class="item">
    <header class="item-head">
      <p class="eyebrow">
        <a :href="`#/pack/${item.pack}`">{{ item.pack }}</a>
        <span>·</span>
        <span>{{ item.kind === 'agent' ? 'وكيل' : 'مهارة' }}</span>
        <span>·</span>
        <span class="num">{{ item.files.length }} ملف · {{ item.lines.toLocaleString('en-US') }} سطر</span>
      </p>
      <h1 dir="ltr" class="item-name">{{ item.name }}</h1>
      <p class="item-desc" dir="ltr">{{ item.description }}</p>

      <div class="install">
        <div v-for="c in commands" :key="c.label" class="install-row">
          <span class="install-label">{{ c.label }}</span>
          <code :dir="c.text.startsWith('sh') ? 'ltr' : 'rtl'">{{ c.text }}</code>
          <CopyButton :text="c.text" />
        </div>
      </div>
    </header>

    <div class="item-body">
      <nav class="files" aria-label="ملفات المهارة">
        <div v-for="[dir, files] in groups" :key="dir" class="files-group">
          <p v-if="dir" class="files-dir" dir="ltr">{{ dir }}/</p>
          <a
            v-for="f in files"
            :key="f.path"
            :href="`#/item/${item.name}/${f.path}`"
            :class="{ active: f.path === file.path }"
            dir="ltr"
          >
            <span>{{ label(f.path) }}</span>
            <span class="num">{{ f.content === null ? '' : f.lines }}</span>
          </a>
        </div>
      </nav>

      <section class="doc" dir="ltr">
        <div class="doc-bar">
          <span class="mono">{{ item.name }}/{{ file.path }}</span>
          <CopyButton v-if="file.content !== null" :text="file.content" label="نسخ المحتوى" />
        </div>
        <img v-if="file.url" :src="file.url" :alt="file.path" class="asset" />
        <img v-else-if="file.path.endsWith('.svg') && file.content" :src="`data:image/svg+xml;utf8,${encodeURIComponent(file.content)}`" :alt="file.path" class="asset" />
        <div class="prose" v-html="html" />
      </section>
    </div>
  </article>
</template>
