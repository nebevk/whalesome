import { defineContentConfig } from "@nuxt/content";

// https://content.nuxt.com/get-started/configuration
export default defineContentConfig({
  // Define content collections
  collections: {
    wiki: {
      path: "content/wiki",
      prefix: "/wiki",
    },
  },
});
