// app/app.config.ts: every global Nuxt UI setting the look depends on.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sage',
      neutral: 'neutral',
    },
    card: {
      slots: {
        root: 'shadow-none',
      },
    },
  },
})
