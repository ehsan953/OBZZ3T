<template>
  <div
    v-motion="stateMotion"
    class="mb-6"
  >
    <OB33ZCard
      :glow="false"
      class="border-2"
      :style="{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 flex-1">
          <component
            :is="config.icon"
            class="w-6 h-6 flex-shrink-0 mt-0.5"
            :style="{ color: config.color }"
          />
          <div>
            <p class="text-[#F4F2ED]">{{ message }}</p>
          </div>
        </div>
        <OB33ZButton
          v-if="action"
          variant="secondary"
          @click="action.onClick"
          class="whitespace-nowrap"
        >
          {{ action.label }}
        </OB33ZButton>
      </div>
    </OB33ZCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type SystemStateType =
  | "verification-required"
  | "muted"
  | "timeout"
  | "restricted"
  | "success";

interface Props {
  type: SystemStateType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const props = defineProps<Props>();

const AlertCircleIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `,
};

const ClockIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
};

const BanIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  `,
};

const CheckCircleIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
};

const config = computed(() => {
  const configs = {
    "verification-required": {
      icon: AlertCircleIcon,
      color: "#C9A24D",
      bgColor: "rgba(201, 162, 77, 0.1)",
      borderColor: "rgba(201, 162, 77, 0.3)",
    },
    muted: {
      icon: BanIcon,
      color: "#5B3FD6",
      bgColor: "rgba(91, 63, 214, 0.1)",
      borderColor: "rgba(91, 63, 214, 0.3)",
    },
    timeout: {
      icon: ClockIcon,
      color: "#C9A24D",
      bgColor: "rgba(201, 162, 77, 0.1)",
      borderColor: "rgba(201, 162, 77, 0.3)",
    },
    restricted: {
      icon: BanIcon,
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
      borderColor: "rgba(220, 38, 38, 0.3)",
    },
    success: {
      icon: CheckCircleIcon,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
  };
  return configs[props.type];
});

const stateMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
</script>
