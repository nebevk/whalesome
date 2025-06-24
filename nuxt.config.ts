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
    "@vueuse/motion/nuxt",
    "@nuxt/fonts",
    "@nuxt/ui",
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
    compatibilityDate: '2025-06-24',
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
});
