<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="isOpen"
        v-motion="backdropMotion"
        class="fixed inset-0 bg-[rgba(11,11,13,0.9)] backdrop-blur-sm z-50 flex items-center justify-center p-6"
        @click="$emit('close')"
      >
        <div
          v-motion="modalMotion"
          class="w-full max-w-md"
          @click.stop
        >
          <OB33ZCard :glow="true">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <component
                  :is="type === 'gift' ? GiftIcon : ZapIcon"
                  class="w-6 h-6 text-[#C9A24D]"
                />
                <div>
                  <h3 class="text-xl text-[#F4F2ED]">{{ type === 'gift' ? 'Send Gift' : 'Send Boost' }}</h3>
                  <p class="text-sm text-[#F4F2ED] opacity-60">to {{ recipientName }}</p>
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

            <div class="grid grid-cols-2 gap-3 mb-6">
              <button
                v-for="item in items"
                :key="item.id"
                v-motion="{
                  initial: { scale: 1 },
                  enter: { scale: 1 },
                }"
                class="p-4 rounded-lg bg-[rgba(244,242,237,0.02)] border border-[rgba(201,162,77,0.15)] hover:border-[#C9A24D] hover:bg-[rgba(201,162,77,0.05)] transition-all"
                @click="$emit('close')"
              >
                <component
                  v-if="type === 'gift'"
                  :is="item.icon"
                  class="w-8 h-8 mx-auto mb-2"
                  :style="{ color: item.color }"
                />
                <ZapIcon
                  v-else
                  class="w-8 h-8 mx-auto mb-2 text-[#C9A24D]"
                />
                <div class="text-sm text-[#F4F2ED] mb-1">{{ item.name }}</div>
                <div v-if="type === 'gift'" class="text-xs text-[#C9A24D]">
                  {{ item.points }} pts
                </div>
                <template v-else>
                  <div class="text-xs text-[#F4F2ED] opacity-60 mb-1">{{ item.duration }}</div>
                  <div class="text-xs text-[#C9A24D]">{{ item.points }} pts</div>
                </template>
              </button>
            </div>

            <div class="flex gap-3">
              <OB33ZButton variant="ghost" @click="$emit('close')" class="flex-1">
                Cancel
              </OB33ZButton>
              <OB33ZButton variant="primary" @click="$emit('close')" class="flex-1">
                Confirm
              </OB33ZButton>
            </div>
          </OB33ZCard>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  isOpen: boolean;
  type: "gift" | "boost";
  recipientName: string;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();

const GiftIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  `,
};

const ZapIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  `,
};

const HeartIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  `,
};

const StarIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  `,
};

const CrownIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `,
};

const SparklesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  `,
};

const props = defineProps<Props>();

const gifts = [
  { id: 1, name: "Heart", icon: HeartIcon, points: 10, color: "#C9A24D" },
  { id: 2, name: "Star", icon: StarIcon, points: 25, color: "#C9A24D" },
  { id: 3, name: "Crown", icon: CrownIcon, points: 50, color: "#C9A24D" },
  { id: 4, name: "Sparkles", icon: SparklesIcon, points: 100, color: "#5B3FD6" },
];

const boosts = [
  { id: 1, name: "Quick Boost", duration: "5 min", points: 20 },
  { id: 2, name: "Power Boost", duration: "15 min", points: 50 },
  { id: 3, name: "Mega Boost", duration: "30 min", points: 100 },
];

const items = computed(() => (props.type === "gift" ? gifts : boosts));

const backdropMotion = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  leave: { opacity: 0, transition: { duration: 0.2 } },
};

const modalMotion = {
  initial: { scale: 0.9, opacity: 0 },
  enter: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  leave: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
};
</script>

<style scoped>
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.2s;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}
</style>
