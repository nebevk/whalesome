import { defineNuxtPlugin } from "#app";
import * as Heroicons from "@heroicons/vue/24/outline";

export default defineNuxtPlugin((nuxtApp) => {
  // Register all Heroicons components globally
  for (const [name, component] of Object.entries(Heroicons)) {
    nuxtApp.vueApp.component(name, component);
  }
});
