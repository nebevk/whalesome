// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    // 'nuxt-og-image' disabled: its composable tree-shaking corrupts the Vite
    // client transform of @vue/runtime-dom in dev, which breaks hydration (the
    // particle canvas and other <ClientOnly> content silently stay on fallback).
    // Revisit via the v6 defineOgImage() API or as a production-only build step.
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
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
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
      routes: ['/', '/about', '/species', '/history', '/populations', '/compare'],
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})
