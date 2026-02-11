<template>
  <div
    v-motion="musicMotion"
    class="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-[rgba(11,11,13,0.8)] backdrop-blur-md border border-[rgba(201,162,77,0.15)] rounded-lg p-3"
  >
    <button
      class="text-[#F4F2ED] hover:text-[#C9A24D] transition-colors"
      @click="toggleMusic"
    >
      <svg
        v-if="isPlaying"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <input
      v-model.number="volume"
      type="range"
      min="0"
      max="100"
      class="w-24 h-1 bg-[rgba(244,242,237,0.1)] rounded-lg appearance-none cursor-pointer accent-[#C9A24D]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isPlaying = ref(false);
const volume = ref(50);

const toggleMusic = () => {
  isPlaying.value = !isPlaying.value;
};

const musicMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      easing: "ease-out",
    },
  },
};
</script>
