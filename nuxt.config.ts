// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    // 'nuxt-og-image' temporarily disabled while bisecting a hydration bug
    // ("Cannot create property 'el' on boolean 'false'" → SpeciesIndexPage rendered
    // as Symbol(v-cmt) on client). Re-enable once root cause is fixed.
  ],

  css: [
    '~/assets/css/tailwind.css',
    'leaflet/dist/leaflet.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
    },
  },

  image: {
    domains: ['images.unsplash.com', 'upload.wikimedia.org'],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280 },
    unsplash: {
      baseURL: 'https://images.unsplash.com/',
    },
  },

  nitro: {
    compatibilityDate: '2025-06-24',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/species'],
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})
