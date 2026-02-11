<template>
  <div
    v-motion="bannerMotion"
    class="mb-6"
  >
    <OB33ZCard
      :glow="true"
      class="bg-gradient-to-r from-[rgba(91,63,214,0.15)] to-[rgba(201,162,77,0.15)] border-[rgba(201,162,77,0.3)]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <svg class="w-6 h-6 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h3 class="text-xl text-[#C9A24D]">{{ title }}</h3>
          </div>
          <p class="text-sm text-[#F4F2ED] opacity-90 mb-4">
            {{ description }}
          </p>
          <div class="flex items-center gap-6 text-sm">
            <div v-if="prize" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span class="text-[#F4F2ED] opacity-80">{{ prize }}</span>
            </div>
            <div v-if="timeLeft" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-[#F4F2ED] opacity-80">{{ timeLeft }}</span>
            </div>
            <div v-if="participants" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-[#F4F2ED] opacity-80">
                {{ participants.toLocaleString() }} entered
              </span>
            </div>
          </div>
        </div>
        <OB33ZButton
          v-if="onEnter"
          variant="primary"
          @click="onEnter"
          class="whitespace-nowrap self-start"
        >
          Enter Now
        </OB33ZButton>
      </div>
    </OB33ZCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  prize?: string;
  timeLeft?: string;
  participants?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  enter: [];
}>();

const onEnter = () => emit("enter");

const bannerMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
</script>
