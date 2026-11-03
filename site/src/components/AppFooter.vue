<script setup lang="ts">
import { Mail } from 'lucide-vue-next';
import { siGithub, siMedium, siX } from 'simple-icons';
import { footer, site, socials } from '../site';
import linkedin from './linkedin.svg?raw';
import ThemeToggle from './ThemeToggle.vue';

const year = new Date().getFullYear();

const paths: Record<string, { viewBox: string; d: string }> = {
  github: { viewBox: '0 0 24 24', d: siGithub.path },
  x: { viewBox: '0 0 24 24', d: siX.path },
  medium: { viewBox: '0 0 24 24', d: siMedium.path },
};
</script>

<template>
  <footer class="mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-7 pb-10">
    <div class="flex flex-wrap items-center gap-x-5 text-[13px] text-faint">
      <p class="w-full sm:w-auto">© {{ site.since }}–{{ year }} {{ site.name }}</p>
      <a v-for="link in footer" :key="link.label" :href="link.to" class="link-muted inline-flex min-h-11 items-center">
        {{ link.label }}
      </a>
    </div>

    <div class="-mr-3 flex items-center">
      <a
        v-for="social in socials"
        :key="social.label"
        :href="social.to"
        :aria-label="social.label"
        target="_blank"
        rel="noopener"
        class="inline-flex size-11 items-center justify-center rounded-lg text-mark transition-colors hover:bg-surface hover:text-fg"
      >
        <Mail v-if="social.icon === 'mail'" :style="{ width: `${social.size}px`, height: `${social.size}px` }" />
        <span
          v-else-if="social.icon === 'linkedin'"
          class="inline-flex [&>svg]:size-full"
          :style="{ width: `${social.size}px`, height: `${social.size}px` }"
          v-html="linkedin"
        />
        <svg
          v-else
          :viewBox="paths[social.icon].viewBox"
          fill="currentColor"
          aria-hidden="true"
          :style="{ width: `${social.size}px`, height: `${social.size}px` }"
        >
          <path :d="paths[social.icon].d" />
        </svg>
      </a>
      <span class="mx-1.5 h-5 w-px bg-line" aria-hidden="true" />
      <ThemeToggle />
    </div>
  </footer>
</template>
