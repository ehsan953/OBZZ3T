<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "#imports";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void }>();

const close = () => emit("update:modelValue", false);

const fullName = ref("");
const userName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const isAuthOpen = ref(false);
const signupError = ref<string | null>(null);

const openSignIn = () => {
  close();
  isAuthOpen.value = true;
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

// Form validation
const isFormValid = computed(() => {
  return (
    fullName.value.trim() !== "" &&
    userName.value.trim() !== "" &&
    email.value.trim() !== "" &&
    password.value.length >= 8 &&
    confirmPassword.value.length >= 8 &&
    password.value === confirmPassword.value
  );
});

const handleSignup = async () => {
  // Reset error
  signupError.value = null;

  // Validate form
  if (!isFormValid.value) {
    signupError.value = "Please fill in all fields correctly. Password must be at least 8 characters.";
    return;
  }

  try {

    await authStore.signup({
      name: fullName.value.trim(),
      username: userName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      password_confirmation: confirmPassword.value,
    });

    // Success - close modal and optionally navigate
    close();
    
  } catch (error: any) {
    signupError.value = authStore.error || "Signup failed. Please try again.";
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="join-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6"
        @click="close"
      >
        <!-- WRAPPER (size/position + holds glow border) -->
        <div
          class="relative w-[calc(100vw-24px)] max-w-[500px] scale-[0.90] xs:scale-[0.95] sm:scale-100"
          @click.stop
        >
          <!-- GLOWING GRADIENT BORDER (yellowish) -->
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

          <!-- EXTRA OUTER SOFT GLOW (optional but makes it pop like your sample) -->
          <div
            class="pointer-events-none absolute -inset-3 rounded-[28px] blur-2xl opacity-35"
          />

          <!-- MODAL BOX (content stays same) -->
          <div
            class="relative h-full max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0B0B0D]/95 font-roboto backdrop-blur-sm border border-[rgba(201,162,77,0.15)] shadow-[#12101E]"
            @keydown="onKeydown"
            tabindex="0"
          >
            <!-- Gold border + soft inner (kept same) -->
            <div
              class="pointer-events-none absolute inset-0 rounded-2xl"
              style="box-shadow: 0px 0px 30px 0px rgba(91, 63, 214, 0.2);"
            />
            <!-- Header -->
            <div class="relative px-5 sm:px-6 pt-5 sm:pt-6">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2
                    class="text-[24px] sm:text-[28px] leading-[30px] sm:leading-[32px] text-[#C9A24D] font-medium"
                  >
                    {{ t("joinModal.title") }}
                  </h2>
                  <p class="mt-2 text-[14px] sm:text-sm text-white/55">
                    {{ t("joinModal.subtitle") }}
                  </p>
                </div>

                <button
                  type="button"
                  class="rounded-md p-2 text-white/45 hover:text-white/80 transition"
                  aria-label="Close"
                  @click="close"
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
                <!-- Full Name -->
                <div>
                  <label
                    class="block text-[14px] font-medium text-white/70 mb-2"
                  >
                    {{ t("joinModal.fullName") }}
                  </label>

                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g opacity="0.4">
                          <path
                            d="M12.6666 14V12.6667C12.6666 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 9.99998 10H5.99998C5.29274 10 4.61446 10.281 4.11436 10.781C3.61426 11.2811 3.33331 11.9594 3.33331 12.6667V14"
                            stroke="#F4F2ED"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.99998 7.33333C9.47274 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47274 2 7.99998 2C6.52722 2 5.33331 3.19391 5.33331 4.66667C5.33331 6.13943 6.52722 7.33333 7.99998 7.33333Z"
                            stroke="#F4F2ED"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                      </svg>
                    </span>

                    <input
                      v-model="fullName"
                      type="text"
                      :placeholder="t('joinModal.fullNamePlaceholder')"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>
                <!-- Username -->
                <div>
                  <label
                    class="block text-[14px] font-medium text-white/70 mb-2"
                  >
                    {{ t("joinModal.userName") }}
                  </label>

                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g opacity="0.4">
                          <path
                            d="M12.6666 14V12.6667C12.6666 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 9.99998 10H5.99998C5.29274 10 4.61446 10.281 4.11436 10.781C3.61426 11.2811 3.33331 11.9594 3.33331 12.6667V14"
                            stroke="#F4F2ED"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.99998 7.33333C9.47274 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47274 2 7.99998 2C6.52722 2 5.33331 3.19391 5.33331 4.66667C5.33331 6.13943 6.52722 7.33333 7.99998 7.33333Z"
                            stroke="#F4F2ED"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                      </svg>
                    </span>

                    <input
                      v-model="userName"
                      type="text"
                      :placeholder="t('joinModal.userNamePlaceholder')"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label
                    class="block text-[14px] font-medium text-white/70 mb-2"
                  >
                    {{ t("joinModal.email") }}
                  </label>

                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    >
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
                      :placeholder="t('joinModal.emailPlaceholder')"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <!-- Password -->
                <div>
                  <label class="block text-sm font-medium text-white/70 mb-2">
                    {{ t("joinModal.password") }}
                  </label>

                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    >
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
                      v-model="password"
                      type="password"
                      :placeholder="t('joinModal.passwordPlaceholder')"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <!-- Confirm Password -->
                <div>
                  <label class="block text-sm font-medium text-white/70 mb-2">
                    {{ t("joinModal.confirmpassword") }}
                  </label>

                  <div class="relative">
                    <span
                      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    >
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
                      :placeholder="t('joinModal.confirmPasswordPlaceholder')"
                      class="w-full rounded-xl border border-[#C9A24D]/15 bg-white/[0.03] pl-11 pr-4 py-4 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#C9A24D]/50 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div
                v-if="signupError || authStore.error"
                class="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {{ signupError || authStore.error }}
              </div>

              <!-- Purple info bar -->
              <div
                class="mt-5 sm:mt-6 font-regular rounded-xl border border-[#5B3FD6]/25 px-4 py-3 sm:py-4 text-[13px] sm:text-sm text-white/70"
                style="
                  background: linear-gradient(
                    90deg,
                    rgba(91, 63, 214, 0.18),
                    rgba(91, 63, 214, 0.08)
                  );
                "
              >
                {{ t("joinModal.info") }}
              </div>

              <!-- CTA -->
              <button
                type="button"
                :disabled="authStore.isLoading || !isFormValid"
                class="mt-5 sm:mt-6 w-full rounded-xl bg-[#C9A24D] py-3.5 sm:py-4 text-center font-bold tracking-widest text-black shadow-[0_18px_50px_rgba(0,0,0,0.60)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleSignup"
              >
                <span v-if="authStore.isLoading">Signing up...</span>
                <span v-else>{{ t("joinModal.joinCta") }}</span>
              </button>

              <!-- Footer -->
              <div
                class="my-6 sm:my-7 border-t border-white/10 pt-4 sm:pt-5 text-center text-[13px] sm:text-sm text-white/45"
              >
                {{ t("joinModal.haveAccount") }}
                <button
                  type="button"
                  class="ml-2 font-medium text-[#C9A24D] hover:opacity-90"
                  @click="openSignIn"
                >
                  {{ t("joinModal.signInLink") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <AuthModal
    :isOpen="isAuthOpen"
    initialMode="signin"
    @close="isAuthOpen = false"
  />
</template>

<style scoped>
/* If you don't have xs breakpoint, remove xs:scale-[0.95] above */
.join-fade-enter-active,
.join-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.join-fade-enter-from,
.join-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
/* Custom scrollbar for the modal */
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
