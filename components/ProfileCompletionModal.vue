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
          class="w-full max-w-lg"
          @click.stop
        >
          <OB33ZCard :glow="true">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl text-[#C9A24D] mb-1">{{ t('completeProfile') }}</h2>
                <p class="text-sm text-[#F4F2ED] opacity-60">
                  {{ t('stepOf', { current: step, total: 2 }) }}
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

            <!-- Progress Bar -->
            <div class="mb-6">
              <div class="h-1 bg-[rgba(244,242,237,0.1)] rounded-full overflow-hidden">
                <div
                  v-motion="progressMotion"
                  class="h-full bg-gradient-to-r from-[#C9A24D] to-[#5B3FD6]"
                />
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <Transition name="step" mode="out-in">
                <div v-if="step === 1" key="step1" class="space-y-4">
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('displayName') }} *
                    </label>
                    <div class="relative">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <OB33ZInput
                        v-model="profileData.displayName"
                        type="text"
                        :placeholder="t('enterDisplayName')"
                        class="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('bio') }}
                    </label>
                    <textarea
                      v-model="profileData.bio"
                      :placeholder="t('tellUsAboutYourself')"
                      rows="4"
                      class="w-full px-4 py-3 bg-[rgba(244,242,237,0.03)] border border-[rgba(201,162,77,0.2)] rounded-lg text-[#F4F2ED] placeholder-[rgba(244,242,237,0.4)] focus:outline-none focus:border-[#C9A24D] focus:bg-[rgba(244,242,237,0.05)] transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('location') }}
                    </label>
                    <div class="relative">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <OB33ZInput
                        v-model="profileData.location"
                        type="text"
                        :placeholder="t('enterLocation')"
                        class="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div v-else key="step2" class="space-y-4">
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('birthday') }}
                    </label>
                    <div class="relative">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <OB33ZInput
                        v-model="profileData.birthday"
                        type="date"
                        class="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('website') }}
                    </label>
                    <div class="relative">
                      <svg
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4F2ED] opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <OB33ZInput
                        v-model="profileData.website"
                        type="url"
                        placeholder="https://"
                        class="pl-10"
                      />
                    </div>
                  </div>

                  <div class="p-4 rounded-lg bg-[rgba(91,63,214,0.1)] border border-[rgba(91,63,214,0.2)]">
                    <div class="flex gap-3">
                      <svg
                        class="w-5 h-5 text-[#C9A24D] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 class="text-sm font-medium text-[#F4F2ED] mb-1">
                          {{ t('almostThere') }}
                        </h4>
                        <p class="text-xs text-[#F4F2ED] opacity-80">
                          {{ t('completeProfileBenefits') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <div class="flex gap-3 pt-4">
                <OB33ZButton
                  v-if="step > 1"
                  type="button"
                  variant="ghost"
                  @click="step--"
                  class="flex-1"
                >
                  {{ t('back') }}
                </OB33ZButton>
                <OB33ZButton
                  type="submit"
                  variant="primary"
                  :class="step === 1 ? 'w-full' : 'flex-1'"
                >
                  {{ step === 2 ? t('complete') : t('continue') }}
                </OB33ZButton>
              </div>
            </form>
          </OB33ZCard>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useLanguage } from "#imports";

const { t } = useLanguage();

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  complete: [profileData: {
    displayName: string;
    bio: string;
    location: string;
    birthday: string;
    website: string;
  }];
}>();

const step = ref(1);
const profileData = ref({
  displayName: "",
  bio: "",
  location: "",
  birthday: "",
  website: "",
});

const progress = computed(() => (step.value / 2) * 100);

const progressMotion = computed(() => ({
  initial: { width: 0 },
  enter: {
    width: `${progress.value}%`,
    transition: { duration: 0.3 },
  },
}));

const props = defineProps<Props>();

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    step.value = 1;
    profileData.value = {
      displayName: "",
      bio: "",
      location: "",
      birthday: "",
      website: "",
    };
  }
});

const handleSubmit = () => {
  if (step.value < 2) {
    step.value++;
  } else {
    emit("complete", profileData.value);
    emit("close");
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
