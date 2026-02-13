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
                    {{ currentStep === 1 ? 'Forgot Password' : currentStep === 2 ? 'Verify OTP' : 'Reset Password' }}
                  </h2>
                  <p class="mt-2 text-[14px] sm:text-sm text-white/55">
                    {{ currentStep === 1 ? 'Enter your email to receive a verification code' : currentStep === 2 ? 'Enter the code sent to your email' : 'Enter your new password' }}
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
              <!-- Step 1: Email Input -->
              <div v-if="currentStep === 1" class="space-y-4 sm:space-y-5">
                <div>
                  <label class="block text-[14px] font-medium text-white/70 mb-2">
                    Email Address
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    </span>
                    <input
                      v-model="email"
                      type="email"
                      placeholder="Enter your email"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
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

                <button
                  type="button"
                  :disabled="authStore.isLoading || !email.trim()"
                  class="w-full rounded-xl bg-[#C9A24D] py-3.5 sm:py-4 text-center font-bold tracking-widest text-black shadow-[0_18px_50px_rgba(0,0,0,0.60)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleSendOTP"
                >
                  <span v-if="authStore.isLoading">Sending...</span>
                  <span v-else>Send Verification Code</span>
                </button>
              </div>

              <!-- Step 2: OTP Verification -->
              <div v-if="currentStep === 2" class="space-y-4 sm:space-y-5">
                <div>
                  <label class="block text-[14px] font-medium text-white/70 mb-2">
                    Verification Code
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11V8a5 5 0 0110 0v3"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6 11h12v10H6V11z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      v-model="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxlength="6"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <!-- Error Message -->
                <div
                  v-if="error"
                  class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {{ error }}
                </div>

                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-[#C9A24D]/30 bg-white/[0.03] py-3.5 sm:py-4 text-center font-medium text-white/70 hover:bg-white/[0.05] transition"
                    @click="currentStep = 1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    :disabled="authStore.isLoading || !otp || otp.length !== 6"
                    class="flex-1 rounded-xl bg-[#C9A24D] py-3.5 sm:py-4 text-center font-bold tracking-widest text-black shadow-[0_18px_50px_rgba(0,0,0,0.60)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="handleVerifyOTP"
                  >
                    <span v-if="authStore.isLoading">Verifying...</span>
                    <span v-else>Verify</span>
                  </button>
                </div>
              </div>

              <!-- Step 3: Reset Password -->
              <div v-if="currentStep === 3" class="space-y-4 sm:space-y-5">
                <div>
                  <label class="block text-[14px] font-medium text-white/70 mb-2">
                    New Password
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11V8a5 5 0 0110 0v3"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6 11h12v10H6V11z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      v-model="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[14px] font-medium text-white/70 mb-2">
                    Confirm New Password
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 11V8a5 5 0 0110 0v3"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6 11h12v10H6V11z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      v-model="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
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

                <div class="flex gap-3">
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-[#C9A24D]/30 bg-white/[0.03] py-3.5 sm:py-4 text-center font-medium text-white/70 hover:bg-white/[0.05] transition"
                    @click="currentStep = 2"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    :disabled="authStore.isLoading || !isPasswordValid"
                    class="flex-1 rounded-xl bg-[#C9A24D] py-3.5 sm:py-4 text-center font-bold tracking-widest text-black shadow-[0_18px_50px_rgba(0,0,0,0.60)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="handleResetPassword"
                  >
                    <span v-if="authStore.isLoading">Resetting...</span>
                    <span v-else>Reset Password</span>
                  </button>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="my-6 sm:my-7 border-t border-white/10 pt-4 sm:pt-5 text-center text-[13px] sm:text-sm text-white/45"
              >
                Remember your password?
                <button
                  type="button"
                  class="ml-2 font-medium text-[#C9A24D] hover:opacity-90"
                  @click="$emit('close')"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

interface Props {
  isOpen: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const currentStep = ref(1);
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const isPasswordValid = computed(() => {
  return (
    newPassword.value.length >= 8 &&
    confirmPassword.value.length >= 8 &&
    newPassword.value === confirmPassword.value
  );
});

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentStep.value = 1;
    email.value = "";
    otp.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    error.value = null;
    successMessage.value = null;
    authStore.error = null;
  }
});

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("close");
};

const handleSendOTP = async () => {
  error.value = null;
  successMessage.value = null;
  authStore.error = null;

  if (!email.value.trim()) {
    error.value = "Please enter your email address";
    return;
  }

  try {
    await authStore.forgotPassword(email.value.trim());
    successMessage.value = "Verification code sent to your email";
    setTimeout(() => {
      currentStep.value = 2;
      successMessage.value = null;
    }, 1500);
  } catch (err: any) {
    error.value = authStore.error || "Failed to send verification code";
  }
};

const handleVerifyOTP = async () => {
  error.value = null;
  authStore.error = null;

  if (!otp.value || otp.value.length !== 6) {
    error.value = "Please enter a valid 6-digit code";
    return;
  }

  try {
    await authStore.verifyOTP(email.value.trim(), otp.value);
    currentStep.value = 3;
  } catch (err: any) {
    error.value = authStore.error || "Invalid verification code";
  }
};

const handleResetPassword = async () => {
  error.value = null;
  successMessage.value = null;
  authStore.error = null;

  if (!isPasswordValid.value) {
    error.value = "Passwords must match and be at least 8 characters long";
    return;
  }

  try {
    await authStore.resetPassword(
      email.value.trim(),
      otp.value,
      newPassword.value,
      confirmPassword.value
    );
    successMessage.value = "Password reset successfully!";
    setTimeout(() => {
      emit("success");
      emit("close");
    }, 1500);
  } catch (err: any) {
    error.value = authStore.error || "Failed to reset password";
  }
};
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
