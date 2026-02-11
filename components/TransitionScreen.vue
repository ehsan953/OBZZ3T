<template>
  <div
    class="transition-screen-container fixed inset-0 bg-[#0B0B0D] z-50 flex items-center justify-center overflow-hidden"
  >
    <!-- Bottom gold light rise -->
    <div
      class="transition-screen-bottom absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#C9A24D] to-transparent"
    />

    <!-- Purple ambient glow increase -->
    <div class="transition-screen-purple absolute inset-0">
      <!-- Left purple glow -->
      <div
        class="absolute top-1/4 left-[18%] w-80 h-80 bg-[#5B3FD6] blur-[120px] rounded-full"
      />
      <!-- Right purple glow -->
      <div
        class="absolute bottom-1/4 right-[18%] w-80 h-80 bg-[#5B3FD6] blur-[120px] rounded-full"
      />
    </div>

    <!-- Logo -->
    <div class="transition-screen-logo relative z-10">
      <h1
        class="text-7xl tracking-wider text-[#C9A24D] font-light"
        style="font-family: 'Tinos', serif"
      >
        OB33Z
      </h1>
    </div>

    <!-- Subtle grain texture -->
    <div class="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits<{
  (e: "complete"): void;
}>();

let timer: number | undefined;

onMounted(() => {
  // Match React timing: call onComplete after ~2500ms
  timer = window.setTimeout(() => {
    emit("complete");
  }, 2500);
});

onBeforeUnmount(() => {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.transition-screen-container {
  /* Fade out near the end of the sequence */
  animation: screenFadeOut 0.8s ease-out 1.7s forwards;
}

.transition-screen-bottom {
  opacity: 0;
  transform: translateY(100%);
  animation: goldRise 0.8s ease-out 0.5s forwards;
}

.transition-screen-purple {
  opacity: 0.1;
  animation: purpleGlowIn 0.8s ease-out 0.5s forwards;
}

.transition-screen-logo {
  opacity: 1;
  transform: scale(1);
  animation: logoPulse 0.8s ease-out 0.5s forwards;
}

@keyframes goldRise {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 0.3;
    transform: translateY(0%);
  }
}

@keyframes purpleGlowIn {
  from {
    opacity: 0.1;
  }
  to {
    opacity: 0.3;
  }
}

@keyframes logoPulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes screenFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
