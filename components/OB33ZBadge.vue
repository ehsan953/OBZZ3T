<template>
  <span
    :class="[
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
      type === 'verified'
        ? 'bg-[rgba(91,63,214,0.2)] text-[#5B3FD6] border border-[#5B3FD6]/30'
        : 'bg-[rgba(201,162,77,0.2)] text-[#C9A24D] border border-[#C9A24D]/30'
    ]"
  >
    <svg
      v-if="type === 'verified'"
      class="w-3 h-3"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>
    <svg
      v-else
      class="w-3 h-3"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    {{ type === "verified" ? "Verified" : "VIP" }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  type: "verified" | "vip";
}>();
</script>
