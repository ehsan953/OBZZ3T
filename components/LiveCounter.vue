<template>
  <div
    v-motion="counterMotion"
    class="fixed top-6 right-6 z-50 bg-[rgba(11,11,13,0.8)] backdrop-blur-md border border-[rgba(201,162,77,0.15)] rounded-lg p-4"
  >
    <h3 class="text-[#C9A24D] text-sm font-medium mb-3">
      {{ t("liveNow") }}
    </h3>
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-[#F4F2ED]">{{ t("theLounge") }}</span>
        <span class="text-sm font-semibold text-[#C9A24D]">247</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-[#F4F2ED]">{{ t("theVibeRoom") }}</span>
        <span class="text-sm font-semibold text-[#C9A24D]">89</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";

const { t } = useI18n();

const counterMotion = {
  initial: { opacity: 0, x: 20 },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      easing: "ease-out",
    },
  },
};
</script>
