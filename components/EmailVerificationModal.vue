<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-[rgba(11,11,13,0.95)] backdrop-blur-sm z-50 flex items-center justify-center p-6"
        @click="$emit('close')"
      >
        <div
          class="relative w-full max-w-md"
          @click.stop
        >
          <!-- GLOWING GRADIENT BORDER -->
          <div
            class="pointer-events-none absolute -inset-0.5 rounded-2xl blur-xl opacity-70 transition duration-700"
            style="
              background: linear-gradient(
                90deg,
                rgba(91, 63, 214, 0.25),
                rgba(91, 63, 214, 0.08),
                rgba(91, 63, 214, 0.25)
              );
            "
          />

          <!-- MODAL BOX -->
          <div
            class="relative h-full max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0B0B0D]/95 font-roboto backdrop-blur-sm border border-[rgba(201,162,77,0.15)] shadow-[#12101E]"
            @keydown="onKeydown"
            tabindex="0"
          >
            <!-- Header -->
            <div class="relative px-5 sm:px-6 pt-5 sm:pt-6">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-[24px] sm:text-[28px] leading-[30px] sm:leading-[32px] text-[#C9A24D] font-medium">
                    Verify Your Email
                  </h2>
                  <p class="mt-2 text-[14px] sm:text-sm text-white/55">
                    We've sent a verification link to your email address
                  </p>
                </div>

                <button
                  type="button"
                  class="rounded-md p-2 text-white/45 hover:text-white/80 transition"
                  aria-label="Close"
                  @click="$emit('close')"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="relative px-5 sm:px-6 pt-5 sm:pt-6">
              <div class="space-y-4 sm:space-y-5">
                <!-- Email Icon -->
                <div class="flex justify-center py-4">
                  <div class="rounded-full bg-[#5B3FD6]/20 p-6">
                    <svg
                      width="48"
                      height="48"
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
                </div>

                <!-- Info Message -->
                <div
                  class="rounded-xl border border-[#5B3FD6]/25 px-4 py-3 sm:py-4 text-[13px] sm:text-sm text-white/70"
                  style="
                    background: linear-gradient(
                      90deg,
                      rgba(91, 63, 214, 0.18),
                      rgba(91, 63, 214, 0.08)
                    );
                  "
                >
                  <p class="mb-2">
                    Please check your email inbox and click on the verification link to verify your account.
                  </p>
                  <p v-if="userEmail" class="font-medium text-[#C9A24D]">
                    {{ userEmail }}
                  </p>
                </div>

                <!-- Error Message -->
                <div
                  v-if="error"
                  class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {{ error }}
                </div>

                <!-- Success Message -->
                <div
                  v-if="successMessage"
                  class="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                >
                  {{ successMessage }}
                </div>

                <!-- Resend Button -->
                <div class="space-y-3">
                  <button
                    type="button"
                    :disabled="authStore.isLoading || resendCooldown > 0"
                    class="w-full rounded-xl border border-[#C9A24D]/30 bg-white/[0.03] py-3.5 sm:py-4 text-center font-medium text-white/70 hover:bg-white/[0.05] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="handleResend"
                  >
                    <span v-if="authStore.isLoading">Sending...</span>
                    <span v-else-if="resendCooldown > 0">
                      Resend in {{ resendCooldown }}s
                    </span>
                    <span v-else>Resend Verification Email</span>
                  </button>

                  <button
                    type="button"
                    class="w-full rounded-xl bg-[#C9A24D] py-3.5 sm:py-4 text-center font-bold tracking-widest text-black shadow-[0_18px_50px_rgba(0,0,0,0.60)] hover:brightness-110 active:scale-[0.99] transition"
                    @click="handleSendVerification"
                  >
                    <span v-if="authStore.isLoading">Sending...</span>
                    <span v-else>Send Verification Email</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

interface Props {
  isOpen: boolean;
  userEmail?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userEmail: "",
});

const emit = defineEmits<{
  close: [];
}>();

const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const resendCooldown = ref(0);
let cooldownInterval: NodeJS.Timeout | null = null;

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    error.value = null;
    successMessage.value = null;
    authStore.error = null;
    resendCooldown.value = 0;
    // Auto-send verification email when modal opens if user is authenticated
    if (authStore.isAuthenticated) {
      setTimeout(() => {
        if (authStore.isAuthenticated) {
          handleSendVerification();
        }
      }, 100);
    }
  }
});

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

const startCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }
    }
  }, 1000);
};

const handleSendVerification = async () => {
  error.value = null;
  successMessage.value = null;
  authStore.error = null;

  if (!authStore.isAuthenticated) {
    error.value = "Please log in to send verification email";
    return;
  }

  try {
    await authStore.sendEmailVerification();
    successMessage.value = "Verification email sent successfully!";
    startCooldown();
  } catch (err: any) {
    error.value = authStore.error || "Failed to send verification email";
  }
};

const handleResend = async () => {
  error.value = null;
  successMessage.value = null;
  authStore.error = null;

  if (!authStore.isAuthenticated) {
    error.value = "Please log in to resend verification email";
    return;
  }

  if (resendCooldown.value > 0) {
    return;
  }

  try {
    await authStore.resendEmailVerification();
    successMessage.value = "Verification email resent successfully!";
    startCooldown();
  } catch (err: any) {
    error.value = authStore.error || "Failed to resend verification email";
  }
};

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
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

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(201, 162, 77, 0.3);
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(201, 162, 77, 0.5);
}
</style>
