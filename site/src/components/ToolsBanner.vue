<script setup lang="ts">
import { apps, MAIN } from '../site';

// Enough copies to fill a wide screen; the second half repeats the first so the loop is seamless.
const row = [...apps, ...apps, ...apps, ...apps];
</script>

<template>
  <section aria-labelledby="my-apps" class="mt-24">
    <div class="flex items-baseline justify-between gap-4">
      <h2 id="my-apps" class="eyebrow">My apps</h2>
      <a :href="`${MAIN}/work`" target="_blank" rel="noopener" class="go link-muted inline-flex min-h-11 items-center text-sm">
        All work<span class="arrow" aria-hidden="true">↗</span>
      </a>
    </div>

    <div class="mt-2 overflow-hidden" style="mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)">
      <div class="marquee flex w-max gap-4 py-1">
        <a
          v-for="(app, i) in row"
          :key="i"
          :href="app.to"
          target="_blank"
          rel="noopener"
          :tabindex="i < apps.length ? 0 : -1"
          :aria-hidden="i >= apps.length ? 'true' : undefined"
          class="flex shrink-0 items-center gap-3.5 rounded-[14px] border border-line py-3 pr-5 pl-3 transition-colors hover:border-chip hover:bg-raised"
        >
          <span class="flex size-11 shrink-0 items-center justify-center rounded-[11px] border border-edge bg-surface text-mark">
            <span
              class="block size-[22px] bg-current"
              :style="{ maskImage: `url(${app.logo})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }"
            />
          </span>
          <span class="flex flex-col">
            <span class="text-[15px] leading-snug font-medium text-fg">{{ app.name }}</span>
            <span class="font-mono text-[12px] text-faint">{{ app.kind }}</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  animation: marquee 50s linear infinite;
}

.marquee:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation: none;
  }
}
</style>
