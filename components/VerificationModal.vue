<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="isOpen"
        v-motion="backdropMotion"
        class="fixed inset-0 bg-[rgba(11,11,13,0.95)] backdrop-blur-sm z-50 flex items-center justify-center p-6"
        @click="$emit('close')"
      >
        <div
          v-motion="modalMotion"
          class="w-full max-w-md"
          @click.stop
        >
          <OB33ZCard :glow="true">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#5B3FD6] flex items-center justify-center">
                  <svg class="w-5 h-5 text-[#0B0B0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl text-[#C9A24D]">{{ t('verifyAccount') }}</h2>
                  <p class="text-sm text-[#F4F2ED] opacity-60">{{ t('unlockAllFeatures') }}</p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                class="text-[#F4F2ED] opacity-60 hover:opacity-100 transition-opacity"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Transition name="step" mode="out-in">
              <!-- Method Selection -->
              <div v-if="step === 'method'" key="method" class="space-y-3">
                <p class="text-sm text-[#F4F2ED] opacity-80 mb-4">
                  {{ t('chooseVerificationMethod') }}
                </p>

                <button
                  v-motion="{ initial: { scale: 1 }, enter: { scale: 1 } }"
                  @click="step = 'email'"
                  class="w-full p-4 rounded-lg bg-[rgba(244,242,237,0.02)] border border-[rgba(201,162,77,0.15)] hover:border-[#C9A24D] hover:bg-[rgba(201,162,77,0.05)] transition-all text-left"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.2)] flex items-center justify-center">
                      <svg class="w-5 h-5 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-[#F4F2ED] font-medium mb-1">{{ t('emailVerification') }}</div>
                      <div class="text-xs text-[#F4F2ED] opacity-60">{{ t('verifyViaEmail') }}</div>
                    </div>
                  </div>
                </button>

                <button
                  v-motion="{ initial: { scale: 1 }, enter: { scale: 1 } }"
                  @click="step = 'phone'"
                  class="w-full p-4 rounded-lg bg-[rgba(244,242,237,0.02)] border border-[rgba(201,162,77,0.15)] hover:border-[#C9A24D] hover:bg-[rgba(201,162,77,0.05)] transition-all text-left"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.2)] flex items-center justify-center">
                      <svg class="w-5 h-5 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-[#F4F2ED] font-medium mb-1">{{ t('phoneVerification') }}</div>
                      <div class="text-xs text-[#F4F2ED] opacity-60">{{ t('verifyViaPhone') }}</div>
                    </div>
                  </div>
                </button>

                <button
                  v-motion="{ initial: { scale: 1 }, enter: { scale: 1 } }"
                  @click="handlePhotoVerificationClick"
                  :class="[
                    'w-full p-4 rounded-lg border transition-all text-left',
                    hasEmailOrPhoneVerified
                      ? 'bg-[rgba(244,242,237,0.02)] border-[rgba(201,162,77,0.15)] hover:border-[#C9A24D] hover:bg-[rgba(201,162,77,0.05)]'
                      : 'bg-[rgba(244,242,237,0.01)] border-[rgba(201,162,77,0.08)] opacity-60 cursor-not-allowed'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[rgba(201,162,77,0.2)] flex items-center justify-center">
                      <svg class="w-5 h-5 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <div class="text-[#F4F2ED] font-medium mb-1">{{ t('photoVerification') }}</div>
                        <svg v-if="!hasEmailOrPhoneVerified" class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div class="text-xs text-[#F4F2ED] opacity-60">
                        <span v-if="hasEmailOrPhoneVerified">{{ t('verifyViaPhoto') }}</span>
                        <span v-else>Requires email or phone verification first</span>
                      </div>
                    </div>
                  </div>
                </button>
                
                <!-- Error message for photo verification requirement -->
                <div
                  v-if="photoVerificationError"
                  class="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-400"
                >
                  {{ photoVerificationError }}
                </div>
              </div>

              <!-- Email Verification -->
              <div v-else-if="step === 'email'" key="email" class="space-y-4">
                <div>
                  <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                    {{ t('emailAddress') }}
                  </label>
                  <div class="relative">
                    <svg
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <OB33ZInput
                      v-model="verificationData.email"
                      type="email"
                      :placeholder="t('enterEmail')"
                      class="pl-10"
                      :disabled="true"
                    />
                  </div>
                </div>

                <div v-if="emailError" class="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400">
                  {{ emailError }}
                </div>
                <div v-else-if="emailInfoMessage" class="p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-sm text-green-400">
                  {{ emailInfoMessage }}
                </div>

                <div class="flex gap-3 pt-2">
                  <OB33ZButton variant="ghost" @click="handleBackToMethod" class="flex-1">
                    {{ t('back') }}
                  </OB33ZButton>
                </div>
              </div>

              <!-- Phone Verification -->
              <div v-else-if="step === 'phone'" key="phone" class="space-y-4">
                <div>
                  <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                    {{ t('phoneNumber') }}
                  </label>
                  <div class="relative">
                    <svg
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <OB33ZInput
                      v-model="verificationData.phone"
                      type="tel"
                      :placeholder="t('enterPhone')"
                      class="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                    {{ t('verificationCode') }}
                  </label>
                  <OB33ZInput
                    v-model="verificationData.code"
                    type="text"
                    :placeholder="t('enterCode')"
                    maxlength="6"
                  />
                </div>

                <div class="p-3 rounded-lg bg-[rgba(91,63,214,0.1)] border border-[rgba(91,63,214,0.2)]">
                  <p class="text-xs text-[#F4F2ED] opacity-80">
                    {{ t('verificationCodeSent') }}
                  </p>
                </div>

                <div v-if="phoneError" class="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400">
                  {{ phoneError }}
                </div>

                <div class="flex gap-3 pt-2">
                  <OB33ZButton variant="ghost" @click="handleBackToMethod" class="flex-1">
                    {{ t('back') }}
                  </OB33ZButton>
                  <OB33ZButton variant="primary" @click="handleSubmitCode" :disabled="authStore.isLoading" class="flex-1">
                    <span v-if="authStore.isLoading">Verifying...</span>
                    <span v-else>{{ t('verify') }}</span>
                  </OB33ZButton>
                </div>
              </div>

              <!-- Photo Verification -->
              <div v-else-if="step === 'photo'" key="photo" class="space-y-4">
                <div class="border-2 border-dashed border-[rgba(201,162,77,0.3)] rounded-lg p-8 text-center">
                  <svg
                    class="w-12 h-12 text-[#C9A24D] mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p class="text-sm text-[#F4F2ED] mb-2">{{ t('uploadPhoto') }}</p>
                  <p class="text-xs text-[#F4F2ED] opacity-60 mb-4">
                    {{ t('photoInstructions') }}
                  </p>
                  <OB33ZButton variant="secondary">
                    {{ t('chooseFile') }}
                  </OB33ZButton>
                </div>

                <div class="flex gap-3 pt-2">
                  <OB33ZButton variant="ghost" @click="handleBackToMethod" class="flex-1">
                    {{ t('back') }}
                  </OB33ZButton>
                  <OB33ZButton variant="primary" @click="handleSubmitCode" class="flex-1">
                    {{ t('submit') }}
                  </OB33ZButton>
                </div>
              </div>

              <!-- Success -->
              <div v-else-if="step === 'success'" key="success" class="text-center py-8">
                <div
                  v-motion="successMotion"
                  class="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#5B3FD6] flex items-center justify-center mx-auto mb-4"
                >
                  <svg class="w-10 h-10 text-[#0B0B0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl text-[#C9A24D] mb-2">{{ t('verificationSuccess') }}</h3>
                <p class="text-sm text-[#F4F2ED] opacity-80 mb-4">{{ t('youAreNowVerified') }}</p>
                <p class="text-xs text-[#F4F2ED] opacity-60">Returning to verification options...</p>
              </div>
            </Transition>
          </OB33ZCard>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useLanguage } from "#imports";
import { useAuthStore } from "~/stores/auth";

const { t } = useLanguage();
const authStore = useAuthStore();

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  verify: [];
}>();

const step = ref<"method" | "email" | "phone" | "photo" | "success">("method");
const verificationData = ref({
  email: "",
  phone: "",  
  code: "",
});
const emailInfoMessage = ref<string | null>(null);
const emailError = ref<string | null>(null);
const phoneError = ref<string | null>(null);
const photoVerificationError = ref<string | null>(null);

// Check if user has email or phone verified
const hasEmailOrPhoneVerified = computed(() => {
  if (!authStore.user) return false;
  const user = authStore.user;
  // Check for email verification
  const emailVerified = user.email_verified_at !== null || 
                       user.is_email_verified === true ||
                       user.email_verified === true;
  // Check for phone verification
  const phoneVerified = user.phone_verified_at !== null ||
                       user.is_phone_verified === true ||
                       user.phone_verified === true;
  
  if (process.client) {
    console.log('Checking verification status:', {
      email_verified_at: user.email_verified_at,
      is_email_verified: user.is_email_verified,
      email_verified: user.email_verified,
      phone_verified_at: user.phone_verified_at,
      is_phone_verified: user.is_phone_verified,
      phone_verified: user.phone_verified,
      emailVerified,
      phoneVerified,
      result: emailVerified || phoneVerified
    });
  }
  
  return emailVerified || phoneVerified;
});

watch(() => props.isOpen, (open) => {
  if (open) {
    // Reset to method selection step when modal opens
    step.value = "method";
    verificationData.value.email = authStore.user?.email || "";
    verificationData.value.phone = authStore.user?.phone_number || "";
    verificationData.value.code = "";
    emailInfoMessage.value = null;
    emailError.value = null;
    phoneError.value = null;
    photoVerificationError.value = null;
  }
});

watch(step, async (newStep) => {
  if (!authStore.isAuthenticated) return;
  try {
    if (newStep === "email") {
      emailInfoMessage.value = null;
      emailError.value = null;
      const res = await authStore.sendEmailVerification();
      emailInfoMessage.value = (res as any)?.message || "Verification email sent successfully";
      setTimeout(() => {
        step.value = "success";
      }, 600);
    } else if (newStep === "phone") {
      await authStore.sendPhoneVerification();
    }
  } catch (e) {
    if (newStep === "email") {
      emailError.value = authStore.error || "Failed to send verification email";
    }
  }
});

// Refresh user data after successful verification and auto-return to method selection
watch(() => step.value === "success", async (isSuccess) => {
  if (isSuccess && authStore.isAuthenticated) {
    // Refresh user data to get updated verification status
    try {
      await authStore.getCurrentUser();
      console.log('User data refreshed after verification:', authStore.user);
      console.log('Phone verified status:', authStore.user?.phone_verified_at || authStore.user?.is_phone_verified || authStore.user?.phone_verified);
    } catch (error) {
      console.error('Failed to refresh user data after verification:', error);
    }
    
    // After 2.5 seconds, automatically return to method selection
    setTimeout(() => {
      step.value = "method";
      // Clear any errors
      emailError.value = null;
      phoneError.value = null;
      photoVerificationError.value = null;
      // Reset verification data
      verificationData.value.code = "";
    }, 2500);
  }
});

const handleBackToMethod = async () => {
  photoVerificationError.value = null;
  step.value = "method";
  
  // Refresh user data when going back to method selection to ensure verification status is up to date
  if (authStore.isAuthenticated) {
    try {
      await authStore.getCurrentUser();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }
};

const handlePhotoVerificationClick = () => {
  photoVerificationError.value = null;
  
  if (!hasEmailOrPhoneVerified.value) {
    photoVerificationError.value = "Please complete email or phone verification first before document verification.";
    return;
  }
  
  // If verified, proceed to photo verification step
  step.value = "photo";
};

const handleSubmitCode = async () => {
  // If we're in phone verification step, verify the code
  if (step.value === "phone") {
    phoneError.value = null;
    
    if (!verificationData.value.phone || !verificationData.value.code) {
      phoneError.value = "Please enter both phone number and verification code";
      return;
    }

    try {
      await authStore.verifyPhoneCode(verificationData.value.phone, verificationData.value.code);
      // On success, move to success step (will auto-return to method selection after 2 seconds)
      step.value = "success";
      emit("verify");
    } catch (error) {
      phoneError.value = authStore.error || "Failed to verify phone. Please check your code and try again.";
    }
  } else {
    // For photo verification or other steps
    step.value = "success";
    emit("verify");
  }
};

const backdropMotion = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  leave: { opacity: 0, transition: { duration: 0.2 } },
};

const modalMotion = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  enter: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3 } },
  leave: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const successMotion = {
  initial: { scale: 0 },
  enter: {
    scale: 1,
    transition: { delay: 0.2, type: "spring", stiffness: 200 },
  },
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

.step-enter-active,
.step-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.step-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.step-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
