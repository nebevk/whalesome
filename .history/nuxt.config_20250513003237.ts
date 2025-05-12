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
    documentDriven: {
      navigation: true,
      page: true,
      surround: true,
    },
    navigation: {
      fields: ["title", "description", "icon"],
    },
    markdown: {
      // Shiki syntax highlighting
      theme: "github-dark",
      // MDC component support
      mdc: true,
      // Markdown options
      remarkPlugins: [],
      rehypePlugins: [],
    },
  },
});
