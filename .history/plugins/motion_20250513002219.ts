import { defineNuxtPlugin } from "#app";
import { MotionPlugin } from "@vueuse/motion/dist/index.mjs";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin, {
    directives: {
      motion: {
        initial: { opacity: 0, y: 100 },
        enter: { opacity: 1, y: 0 },
        leave: { opacity: 0, y: -100 },
      },
    },
  });
});
