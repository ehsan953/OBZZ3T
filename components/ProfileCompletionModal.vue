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
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <Transition name="step" mode="out-in">
                <!-- Step 1: Basic Info -->
                <div v-if="step === 1" key="step1" class="space-y-4">
                  <!-- Profile Images Upload -->
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      Profile Photos * <span class="text-xs opacity-60">(At least 1 required)</span>
                    </label>
                    
                    <!-- Image Preview Grid -->
                    <div class="grid grid-cols-4 gap-3 mb-3">
                      <div
                        v-for="(image, index) in profileImages"
                        :key="index"
                        class="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          :src="image.preview"
                          :alt="`Profile ${index + 1}`"
                          class="w-full h-full object-cover"
                        />
                        <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            @click="removeImage(index)"
                            class="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- Primary Badge -->
                        <div
                          v-if="index === 0"
                          class="absolute top-1 left-1 px-1.5 py-0.5 bg-[#C9A24D] text-[#0B0B0D] text-xs rounded font-medium"
                        >
                          Primary
                        </div>
                      </div>
                      
                      <!-- Upload Button -->
                      <label
                        v-if="profileImages.length < 6"
                        class="aspect-square rounded-lg border-2 border-dashed border-[rgba(201,162,77,0.3)] hover:border-[#C9A24D] transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 bg-[rgba(244,242,237,0.02)] hover:bg-[rgba(244,242,237,0.05)] group"
                      >
                        <svg
                          class="w-6 h-6 text-[#F4F2ED] opacity-40 group-hover:opacity-60 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="text-xs text-[#F4F2ED] opacity-40 group-hover:opacity-60">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          class="hidden"
                          @change="handleImageUpload"
                        />
                      </label>
                    </div>
                    
                    <p class="text-xs text-[#F4F2ED] opacity-40 mt-1">
                      Upload up to 6 photos. First photo will be your primary.
                    </p>
                    
                    <!-- Validation Error -->
                    <p v-if="imageError" class="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ imageError }}
                    </p>
                  </div>

                  <!-- Display Name -->
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

                  <!-- Bio -->
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      {{ t('bio') }}
                    </label>
                    <textarea
                      v-model="profileData.bio"
                      :placeholder="t('tellUsAboutYourself')"
                      rows="3"
                      class="w-full px-4 py-3 bg-[rgba(244,242,237,0.03)] border border-[rgba(201,162,77,0.2)] rounded-lg text-[#F4F2ED] placeholder-[rgba(244,242,237,0.4)] focus:outline-none focus:border-[#C9A24D] focus:bg-[rgba(244,242,237,0.05)] transition-all"
                    />
                  </div>
                </div>

                <!-- Step 2: Location & Contact -->
                <div v-else key="step2" class="space-y-4">
                  <!-- City -->
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      City *
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
                        v-model="profileData.city"
                        type="text"
                        placeholder="Enter your city"
                        class="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <!-- State -->
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      State *
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
                        v-model="profileData.state"
                        type="text"
                        placeholder="Enter your state"
                        class="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <!-- Phone Number (Moved from step 1) -->
                  <div>
                    <label class="block text-sm text-[#F4F2ED] opacity-80 mb-2">
                      Phone Number *
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
                        v-model="profileData.phone_number"
                        type="tel"
                        placeholder="Enter your phone number"
                        class="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <!-- Birthday -->
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

                  <!-- Success Message Box -->
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

              <!-- Navigation Buttons -->
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
                  :disabled="step === 1 && profileImages.length === 0"
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
import { ref, computed, watch, onUnmounted } from "vue";
import { useLanguage } from "#imports";

const { t } = useLanguage();

interface Props {
  isOpen: boolean;
}

interface ProfileImage {
  file: File;
  preview: string;
}

const emit = defineEmits<{
  close: [];
  complete: [profileData: {
    displayName: string;
    bio: string;
    city: string;
    state: string;
    phone_number: string;
    birthday: string;
    profileImages: File[];
  }];
}>();

const step = ref(1);
const profileImages = ref<ProfileImage[]>([]);
const imageError = ref<string>("");

const profileData = ref({
  displayName: "",
  bio: "",
  city: "",
  state: "",
  phone_number: "",
  birthday: "",
});

const props = defineProps<Props>();

const progress = computed(() => (step.value / 2) * 100);

const progressMotion = computed(() => ({
  initial: { width: 0 },
  enter: {
    width: `${progress.value}%`,
    transition: { duration: 0.3 },
  },
}));

// Reset form when modal closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    step.value = 1;
    profileData.value = {
      displayName: "",
      bio: "",
      city: "",
      state: "",
      phone_number: "",
      birthday: "",
    };
    // Clean up image previews with safe check
    if (profileImages.value.length > 0) {
      profileImages.value.forEach(img => {
        if (img && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    }
    profileImages.value = [];
    imageError.value = "";
  }
});

// Handle image upload
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  imageError.value = "";
  
  const newImages: ProfileImage[] = [];
  const remainingSlots = 6 - profileImages.value.length;
  const filesToAdd = Array.from(input.files).slice(0, remainingSlots);

  for (const file of filesToAdd) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      imageError.value = "Please upload only image files";
      continue;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = "Image size should be less than 5MB";
      continue;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    newImages.push({ file, preview });
  }

  profileImages.value = [...profileImages.value, ...newImages];
  
  // Reset input
  input.value = '';
};
const removeImage = (index: number) => {
  // Check if index is valid
  if (index >= 0 && index < profileImages.value.length) {
    const imageToRemove = profileImages.value[index];
    
    // Check if image exists before revoking
    if (imageToRemove && imageToRemove.preview) {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    // Remove the image from the array
    profileImages.value.splice(index, 1);
  }
};

const handleSubmit = () => {
  if (step.value === 1) {
    // Validate at least one image
    if (profileImages.value.length === 0) {
      imageError.value = "At least one profile photo is required";
      return;
    }
    step.value++;
  } else {
    // Submit complete profile data
    emit("complete", {
      ...profileData.value,
      profileImages: profileImages.value.map(img => img.file)
    });
    emit("close");
  }
};

// Animation motions
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

// Clean up previews on component unmount
onUnmounted(() => {
  if (profileImages.value.length > 0) {
    profileImages.value.forEach(img => {
      if (img && img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });
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