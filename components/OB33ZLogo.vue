<template>
  <component
    :is="animated ? 'div' : 'h1'"
    v-motion="logoMotion"
    :class="[
      sizes[size],
      'tracking-wider text-[#C9A24D] font-light',
    ]"
    style="font-family: 'Tinos', serif"
  >
    OB33Z
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  animated: false,
});

const sizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-7xl",
};

const logoMotion = computed(() => {
  if (!props.animated) return {};
  return {
    initial: { opacity: 0, scale: 0.9 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8 },
    },
  };
});
</script>
