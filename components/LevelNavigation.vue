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
        
        <!-- Logout Button (only shown when authenticated) -->
        <button
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          :disabled="authStore.isLoading"
          class="px-4 py-2 rounded-md transition-colors text-[#F4F2ED] hover:bg-red-500/20 hover:text-red-400 border-t border-[rgba(201,162,77,0.15)] mt-1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-sm font-medium">
            {{ authStore.isLoading ? 'Logging out...' : 'Logout' }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const levels = [
  { path: "/lounge", name: t("theLounge"), level: 1, isLive: true },
  { path: "/vibe-room", name: t("theVibeRoom"), level: 2, isLive: true },
];

const activeLevels = levels.filter((level) => level.isLive);

const isActive = (path: string) => route.path === path;

const handleLogout = async () => {
  try {
    await authStore.logout();
    // Redirect to home page after logout
    await router.push('/');
  } catch (error) {
    // Error is already handled in authStore
    console.error('Logout failed:', error);
  }
};

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
