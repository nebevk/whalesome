// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
    "@vueuse/motion/nuxt",
    "@nuxt/fonts",
  ],
  css: ["~/assets/css/tailwind.css"],
  build: {
    transpile: [],
  },
  runtimeConfig: {
    public: {
      motion: {
        directives: {
          "zoom-bg": {
            initial: {
              scale: 1,
            },
            visible: {
              scale: 1.1,
            },
            transition: {
              duration: 1000,
            },
          },
        },
      },
    },
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
