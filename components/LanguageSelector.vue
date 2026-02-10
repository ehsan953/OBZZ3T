<!-- components/LanguageToggle.vue -->
<template>
  <div
    class="relative flex items-center gap-3 rounded-lg p-1 bg-[rgba(244,242,237,0.05)] border border-[rgba(201,162,77,0.15)]"
  >
    <!-- Sliding indicator -->
    <div
      class="absolute top-[4px] left-[4px] h-[28px] w-[44px] rounded-md bg-[#C9A24D] transition-transform duration-300 ease-out"
      :class="indicatorClass"
    />

    <!-- EN -->
    <button
      type="button"
      @click="setLang('en')"
      class="relative z-10 px-3 py-1 text-sm"
    >
      <span
        :class="
          locale === 'en' ? 'text-[#0B0B0D]' : 'text-[#F4F2ED] opacity-60'
        "
      >
        EN
      </span>
    </button>

    <!-- ES -->
    <button
      type="button"
      @click="setLang('es')"
      class="relative z-10 px-3 py-1 text-sm"
    >
      <span
        :class="
          locale === 'es' ? 'text-[#0B0B0D]' : 'text-[#F4F2ED] opacity-60'
        "
      >
        ES
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";

const { locale, setLocale } = useI18n();

function setLang(lang: "en" | "es") {
  if (locale.value === lang) return;
  setLocale(lang);
}

/**
 * Exact movement:
 * - EN: x = 0
 * - ES: button width (44) + gap (8) = 52px
 */
const indicatorClass = computed(() =>
  locale.value === "en" ? "translate-x-0" : "translate-x-[52px]"
);
</script>

<style scoped>
button {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
}
</style>
