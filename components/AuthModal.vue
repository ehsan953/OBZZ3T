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
              <div>
                <h2 class="text-2xl text-[#C9A24D] mb-1">
                  {{ t('welcomeBack') }}
                </h2>
                <p class="text-sm text-[#F4F2ED] opacity-60">
                  {{ t('signInToContinue') }}
                </p>
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

            <!-- Error Message -->
            <div
              v-if="loginError"
              class="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {{ loginError }}
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                  {{ t('email') }}
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
                    v-model="formData.email"
                    type="email"
                    :placeholder="t('enterEmail')"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                  {{ t('password') }}
                </label>
                <div class="relative">
                  <svg
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <OB33ZInput
                    v-model="formData.password"
                    type="password"
                    :placeholder="t('enterPassword')"
                    class="pl-10"
                    required
                  />
                </div>
              </div>

              <OB33ZButton 
                type="submit" 
                variant="primary" 
                class="w-full"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading">Signing in...</span>
                <span v-else>{{ t('signIn') }}</span>
              </OB33ZButton>
            </form>

            <div class="mt-4 text-center">
              <button
                type="button"
                @click="isForgotPasswordOpen = true"
                class="text-sm text-[#C9A24D] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div class="mt-6 pt-6 border-t border-[rgba(201,162,77,0.15)] text-center">
              <p class="text-sm text-[#F4F2ED] opacity-60">
                {{ t('dontHaveAccount') }}
                <button
                  type="button"
                  @click="isJoinOpen = true"
                  class="text-[#C9A24D] hover:underline ml-1"
                >
                  {{ t('join') }}
                </button>
              </p>
            </div>
          </OB33ZCard>
        </div>
        <Join v-model="isJoinOpen" />
        <ForgotPasswordModal 
          :isOpen="isForgotPasswordOpen" 
          @close="isForgotPasswordOpen = false"
          @success="handlePasswordResetSuccess"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLanguage } from "#imports";
import { useAuthStore } from "~/stores/auth";

const { t } = useLanguage();
const authStore = useAuthStore();
const isJoinOpen = ref(false);
const isForgotPasswordOpen = ref(false);
const loginError = ref<string | null>(null);

interface Props {
  isOpen: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  close: [];
  success: [userData: { name: string; email: string }];
}>();

const formData = ref({
  email: "",
  password: "",
});

// Reset form when modal opens
onMounted(() => {
  loginError.value = null;
  authStore.error = null;
});

const handleSubmit = async () => {
  loginError.value = null;
  authStore.error = null;

  try {
    await authStore.login({
      email: formData.value.email,
      password: formData.value.password,
    });

    // Success - emit success with user data
    emit("success", {
      name: authStore.user?.name || "Member",
      email: formData.value.email,
    });
    
    // Close the modal
    emit("close");
    
    // Reset form
    formData.value = {
      email: "",
      password: "",
    };
    
  } catch (error: any) {
    loginError.value = authStore.error || "Login failed. Please check your credentials.";
  }
};

const handlePasswordResetSuccess = () => {
  // Close forgot password modal and show success message
  isForgotPasswordOpen.value = false;
  loginError.value = null;
  // Optionally show a success message or auto-fill email
};

const backdropMotion = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  leave: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const modalMotion = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  enter: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, easing: "ease-out" },
  },
  leave: {
    scale: 0.9,
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
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
</style>
