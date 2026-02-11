<template>
  <div
    v-motion="containerMotion"
    class="fixed inset-0 bg-[#0B0B0D] z-50 flex items-center justify-center overflow-hidden"
  >
    <!-- Bottom gold light rise -->
    <div
      v-motion="goldGlowMotion"
      class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#C9A24D] to-transparent"
    />

    <!-- Purple ambient glow increase -->
    <div
      v-motion="purpleGlowMotion"
      class="absolute inset-0"
    >
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5B3FD6] blur-[120px] rounded-full" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5B3FD6] blur-[120px] rounded-full" />
    </div>

    <!-- Logo -->
    <div
      v-motion="logoMotion"
      class="relative z-10"
    >
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
import { onMounted } from "vue";

const emit = defineEmits<{
  complete: [];
}>();

onMounted(() => {
  const timer1 = setTimeout(() => {
    // Stage 1: Gold glow rises
  }, 500);
  const timer2 = setTimeout(() => {
    // Stage 2: Purple glow increases
  }, 1500);
  const timer3 = setTimeout(() => {
    emit("complete");
  }, 2500);

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
    clearTimeout(timer3);
  };
});

const containerMotion = {
  initial: { opacity: 1 },
  enter: { opacity: 1 },
  leave: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const goldGlowMotion = {
  initial: { y: "100%", opacity: 0 },
  enter: {
    y: "0%",
    opacity: 0.3,
    transition: { delay: 0.5, duration: 0.8 },
  },
};

const purpleGlowMotion = {
  initial: { opacity: 0.1 },
  enter: {
    opacity: 0.3,
    transition: { delay: 0.5, duration: 0.8 },
  },
};

const logoMotion = {
  initial: { scale: 1, opacity: 1 },
  enter: {
    scale: 1.05,
    opacity: 1,
    transition: { delay: 0.5, duration: 0.8 },
  },
  leave: {
    scale: 1,
    opacity: 0,
    transition: { duration: 0.8 },
  },
};
</script>
