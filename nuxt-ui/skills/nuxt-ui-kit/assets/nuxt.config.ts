// nuxt.config.ts for a dashboard behind a login. For a public site see references/static-seo.md.
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  // Every /api call comes from the browser, which keeps the API guard simple.
  ssr: false,

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#317455' }],
    },
  },

  // Without 'arabic' in subsets every Arabic letter falls back to the system font.
  fonts: {
    families: [
      { name: 'IBM Plex Sans Arabic', provider: 'google', weights: [400, 500, 600, 700], subsets: ['arabic', 'latin'] },
      { name: 'IBM Plex Mono', provider: 'google', weights: [400, 500, 700], subsets: ['latin'] },
    ],
  },

  icon: {
    serverBundle: 'local',
  },

  runtimeConfig: {
    public: { version },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': 'frame-ancestors \'none\'',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'same-origin',
      },
    },
  },

  devtools: { enabled: false },

  compatibilityDate: '2026-10-01',
})
