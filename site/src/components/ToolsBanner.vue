<script setup lang="ts">
import { apps, MAIN } from '../site';

// Enough copies to fill a wide screen; the second half repeats the first so the loop is seamless.
const row = [...apps, ...apps, ...apps, ...apps];

// A fixed, shuffled letter field for the background texture.
const LETTERS = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const field = Array.from({ length: 9 }, (_, r) =>
  Array.from({ length: 34 }, (_, c) => LETTERS[(r * 7 + c * 13 + r * c) % LETTERS.length]).join(' '),
);
</script>

<template>
  <section aria-labelledby="my-apps" class="relative mt-24 overflow-hidden rounded-[20px] border border-line bg-raised">
    <div
      class="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style="background: radial-gradient(60% 70% at 50% 60%, color-mix(in srgb, var(--color-iris-500) 10%, transparent), transparent 70%)"
    />
    <pre
      class="pointer-events-none absolute inset-x-0 top-10 m-0 text-center font-mono text-[11px] leading-[2.4] tracking-[0.4em] text-faint/25 select-none"
      aria-hidden="true"
      style="mask-image: radial-gradient(55% 60% at 50% 50%, #000, transparent 75%)"
    >{{ field.join('\n') }}</pre>

    <div class="relative pt-10" style="mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)">
      <div class="marquee flex w-max gap-16 px-8">
        <a
          v-for="(app, i) in row"
          :key="i"
          :href="app.to"
          target="_blank"
          rel="noopener"
          :tabindex="i < apps.length ? 0 : -1"
          :aria-hidden="i >= apps.length ? 'true' : undefined"
          class="group flex shrink-0 items-center gap-3 opacity-60 transition-opacity hover:opacity-100"
        >
          <span
            class="block size-9 shrink-0 bg-current text-mark"
            :style="{ maskImage: `url(${app.logo})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }"
          />
          <span class="flex flex-col">
            <span class="text-[20px] leading-tight font-semibold tracking-[-0.02em] text-fg">{{ app.name }}</span>
            <span class="font-mono text-[11.5px] text-faint">{{ app.kind }}</span>
          </span>
        </a>
      </div>
    </div>

    <div class="relative px-6 pt-12 pb-12 text-center">
      <h2 id="my-apps" class="text-[26px] leading-tight font-semibold tracking-[-0.02em] md:text-[34px]">Apps I build</h2>
      <p class="mx-auto mt-3 max-w-[46ch] text-[15px] leading-[1.7] text-muted">
        Small, focused tools for the Mac and the web,
        <span class="text-fg">made by the same hands</span> as these skills.
      </p>
      <a :href="`${MAIN}/work`" class="link-underline mt-5 inline-block text-[14px]">See all my work</a>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  animation: marquee 40s linear infinite;
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
