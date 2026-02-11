<template>
  <Teleport to="body">
    <div
      v-motion="backdropMotion"
      class="fixed inset-0 bg-[rgba(11,11,13,0.9)] backdrop-blur-sm z-50 flex items-center justify-center p-6"
      @click="$emit('close')"
    >
      <div
        v-motion="cardMotion"
        class="w-full max-w-md"
        @click.stop
      >
        <OB33ZCard :glow="true">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#5B3FD6] flex items-center justify-center text-[#0B0B0D] text-2xl font-medium"
              >
                {{ user.name[0] }}
              </div>
              <div>
                <h3 class="text-xl text-[#F4F2ED] mb-1">{{ user.name }}</h3>
                <div class="flex items-center gap-2">
                  <OB33ZBadge v-if="user.verified" type="verified" />
                  <OB33ZBadge v-if="user.vip" type="vip" />
                </div>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="text-[#F4F2ED] opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="text-center">
              <div class="text-2xl text-[#C9A24D] font-medium mb-1">
                {{ user.stats.level }}
              </div>
              <div class="text-xs text-[#F4F2ED] opacity-60">{{ t("level") }}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl text-[#C9A24D] font-medium mb-1">
                {{ user.stats.messages }}
              </div>
              <div class="text-xs text-[#F4F2ED] opacity-60">{{ t("messages") }}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl text-[#C9A24D] font-medium mb-1">
                {{ user.stats.gifts }}
              </div>
              <div class="text-xs text-[#F4F2ED] opacity-60">{{ t("gifts") }}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl text-[#C9A24D] font-medium mb-1">
                {{ user.stats.boosts }}
              </div>
              <div class="text-xs text-[#F4F2ED] opacity-60">{{ t("boosts") }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <OB33ZButton variant="primary" class="flex-1 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {{ t("invite") }}
            </OB33ZButton>
            <OB33ZButton variant="ghost" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {{ t("block") }}
            </OB33ZButton>
          </div>
        </OB33ZCard>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useLanguage } from "#imports";

const { t } = useLanguage();

interface Props {
  user: {
    name: string;
    verified: boolean;
    vip?: boolean;
    images: string[];
    stats: {
      messages: number;
      gifts: number;
      boosts: number;
      level: number;
    };
  };
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

const backdropMotion = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  leave: { opacity: 0, transition: { duration: 0.2 } },
};

const cardMotion = {
  initial: { scale: 0.9, opacity: 0 },
  enter: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  leave: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};
</script>
