<template>
  <nav class="fixed top-6 left-6 z-50">
    <div
      v-motion="navMotion"
      class="bg-[rgba(11,11,13,0.8)] backdrop-blur-md border border-[rgba(201,162,77,0.15)] rounded-lg p-2"
    >
      <div class="flex flex-col gap-1">
        <NuxtLink
          v-for="level in activeLevels"
          :key="level.path"
          :to="level.path"
          class="relative"
        >
          <div
            :class="[
              'px-4 py-2 rounded-md transition-colors',
              isActive(level.path)
                ? 'bg-[#C9A24D] text-[#0B0B0D]'
                : 'text-[#F4F2ED] hover:bg-[rgba(201,162,77,0.1)]'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs opacity-60">Level {{ level.level }}</span>
              <span class="text-sm font-medium">{{ level.name }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();

const levels = [
  { path: "/lounge", name: t("theLounge"), level: 1, isLive: true },
  { path: "/vibe-room", name: t("theVibeRoom"), level: 2, isLive: true },
];

const activeLevels = levels.filter((level) => level.isLive);

const isActive = (path: string) => route.path === path;

const navMotion = {
  initial: { opacity: 0, x: -20 },
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
