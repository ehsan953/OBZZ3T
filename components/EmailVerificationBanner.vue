<template>
  <Transition name="banner-fade">
    <div
      v-if="shouldShow"
      v-motion="bannerMotion"
      class="mb-6"
    >
      <OB33ZCard
        class="bg-gradient-to-r from-[rgba(91,63,214,0.15)] to-[rgba(201,162,77,0.15)] border-[rgba(201,162,77,0.3)]"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            <div class="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.2)] flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                class="text-[#C9A24D]"
              >
                <path
                  d="M4 6h16v12H4V6z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 7l8 6 8-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-[#C9A24D] font-medium mb-1">
                Verify Your Email
              </h3>
              <p class="text-sm text-[#F4F2ED] opacity-80">
                Complete your profile and verify your email to unlock all features and participate in rooms.
              </p>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <OB33ZButton
              v-if="!isProfileCompleted"
              variant="ghost"
              @click="$emit('completeProfile')"
              class="whitespace-nowrap"
            >
              Complete Profile
            </OB33ZButton>
            <OB33ZButton
              variant="primary"
              @click="$emit('verifyEmail')"
              class="whitespace-nowrap"
            >
              Verify Email
            </OB33ZButton>
          </div>
        </div>
      </OB33ZCard>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const props = defineProps<{
  show?: boolean;
}>();

const emit = defineEmits<{
  completeProfile: [];
  verifyEmail: [];
}>();

const isVerified = computed(() => {
  return authStore.user?.is_verified === true || authStore.user?.email_verified_at !== null;
});

const isProfileCompleted = computed(() => {
  return authStore.user?.profile_completed === true;
});

const shouldShow = computed(() => {
  // Show if explicitly set to show, or if user is authenticated but not verified
  if (props.show !== undefined) {
    return props.show;
  }
  return authStore.isAuthenticated && !isVerified.value;
});

const bannerMotion = {
  initial: { opacity: 0, y: -10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, easing: "ease-out" },
  },
};
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
