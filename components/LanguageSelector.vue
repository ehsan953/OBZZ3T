<template>
  <div
    class="flex items-center gap-2 bg-[rgba(244,242,237,0.05)] rounded-lg p-1 border border-[rgba(201,162,77,0.15)]"
  >
    <button
      @click="setLanguage('en')"
      class="relative px-3 py-1 text-sm transition-colors duration-200"
    >
      <div
        v-if="language === 'en'"
        v-motion="{
          initial: false,
          enter: {
            x: 0,
            transition: { type: 'spring', duration: 0.5 },
          },
        }"
        class="absolute inset-0 bg-[#C9A24D] rounded-md"
      />
      <span
        :class="[
          'relative z-10',
          language === 'en' ? 'text-[#0B0B0D]' : 'text-[#F4F2ED] opacity-60',
        ]"
      >
        EN
      </span>
    </button>
    <button
      @click="setLanguage('es')"
      class="relative px-3 py-1 text-sm transition-colors duration-200"
    >
      <div
        v-if="language === 'es'"
        v-motion="{
          initial: false,
          enter: {
            x: 0,
            transition: { type: 'spring', duration: 0.5 },
          },
        }"
        class="absolute inset-0 bg-[#C9A24D] rounded-md"
      />
      <span
        :class="[
          'relative z-10',
          language === 'es' ? 'text-[#0B0B0D]' : 'text-[#F4F2ED] opacity-60',
        ]"
      >
        ES
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "#imports";

const { language, setLanguage } = useLanguage();
</script>

<style scoped>
button {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
}
</style>
