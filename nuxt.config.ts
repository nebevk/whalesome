// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  fonts: {
    families: [
      { name: 'Fredoka', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'Merriweather Sans', provider: 'google', weights: [400, 700], global: true },
      { name: 'Rouge Script', provider: 'google', weights: [400], global: true },
    ],
  },

  css: [
    '~/assets/css/tailwind.css',
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
      // Simple Analytics: cookie-free visitor stats, so no consent banner. latest.js also
      // counts client-side route changes; auto-events.js counts clicks on outbound links
      // (Ko-fi, iNaturalist, photo credits). Both skip localhost.
      script: [
        { src: 'https://scripts.simpleanalyticscdn.com/latest.js', async: true, tagPosition: 'bodyClose' },
        { src: 'https://scripts.simpleanalyticscdn.com/auto-events.js', async: true, 'data-collect': 'outbound', tagPosition: 'bodyClose' },
      ],
    },
  },

  image: {
    // Resize at the source CDNs instead of IPX; see providers/remote.ts for why.
    provider: 'remote',
    providers: {
      remote: { provider: '~/providers/remote.ts' },
    },
    domains: ['images.unsplash.com', 'upload.wikimedia.org'],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280 },
    unsplash: {
      baseURL: 'https://images.unsplash.com/',
    },
  },

  nitro: {
    compatibilityDate: '2025-06-24',
    // Nitro rewrites `typeof window` to "undefined" with a regex that also matches
    // `typeof window$1`, the name Rollup gives VueUse's local `window` in some chunks,
    // which left `"undefined"$1` in the server bundle and broke `npm run generate`.
    // An identity replacement switches that rewrite off; on the server
    // `typeof window` is "undefined" at runtime anyway.
    replace: { 'typeof window': 'typeof window' },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/species', '/history', '/populations', '/compare', '/anatomy'],
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})
