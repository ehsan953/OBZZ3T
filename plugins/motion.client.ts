import { MotionPlugin } from "@vueuse/motion";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  // Register VueUse Motion plugin on client-side
  nuxtApp.vueApp.use(MotionPlugin);
});

