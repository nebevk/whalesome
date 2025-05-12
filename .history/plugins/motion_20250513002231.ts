import { defineNuxtPlugin } from "#app";
import { MotionPlugin } from "@vueuse/motion";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin, {
    directives: {
      motion: {
        initial: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
      },
    },
  });
});
