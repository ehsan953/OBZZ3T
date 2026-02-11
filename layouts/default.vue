<template>
  <div class="relative min-h-screen bg-[#050608] text-[#F4F2ED]">
    <!-- Global transition/loading screen overlay -->
    <TransitionScreen
      v-if="showTransition"
      @complete="completeTransition"
    />

    <slot />
  </div>
</template>

<script setup lang="ts">
import TransitionScreen from "~/components/TransitionScreen.vue";
import { useTransitionScreen } from "~/composables/useTransitionScreen";

const { show: showTransition, completeTransition } = useTransitionScreen();
</script>
