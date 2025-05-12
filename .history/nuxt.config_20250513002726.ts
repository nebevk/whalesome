// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"],
  css: ["~/assets/css/tailwind.css"],
  build: {
    transpile: ["@vueuse/motion"],
  },
  content: {
    // Content module options
    documentDriven: true,
    navigation: {
      fields: ["title", "description", "icon"],
    },
    markdown: {
      // Shiki syntax highlighting
      theme: "github-dark",
      // MDC component support
      mdc: true,
    },
  },
});
