<template>
  <div
    :class="[
      'rounded-lg p-6 bg-[rgba(11,11,13,0.8)] backdrop-blur-sm border',
      glow
        ? 'border-[rgba(201,162,77,0.3)] shadow-[0_0_30px_rgba(201,162,77,0.1)]'
        : 'border-[rgba(201,162,77,0.15)]',
      $attrs.class
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  glow?: boolean;
}>();
</script>
