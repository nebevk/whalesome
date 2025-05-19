// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
  css: ["~/assets/css/tailwind.css"],
  build: {
    transpile: ["@vueuse/motion"],
  },
  nitro: {
    compatibilityDate: "2025-05-16",
  },
  content: {
    experimental: {
      nativeSqlite: true,
    },
  },
});
