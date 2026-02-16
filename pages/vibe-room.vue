<template>
  <div class="relative min-h-screen p-6">
    <LevelNavigation />
    <LiveCounter />
    <MusicToggle />

    <!-- Ambient background effects -->
    <div class="fixed inset-0 pointer-events-none">
      <div
        class="absolute top-1/4 left-1/3 w-96 h-96 bg-[#5B3FD6] opacity-8 blur-[120px] rounded-full"
      />
      <div
        class="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#5B3FD6] opacity-8 blur-[120px] rounded-full"
      />
    </div>

    <div class="relative max-w-7xl mx-auto pt-20">
      <!-- Header -->
      <div v-motion="headerMotion" class="text-center mb-8">
        <h1 class="text-4xl text-[#C9A24D] mb-2">{{ t("vibeRoomTitle") }}</h1>
        <div class="flex items-center justify-center gap-2 text-[#F4F2ED] opacity-70">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p>{{ t("verifiedOnly") }}</p>
        </div>
      </div>

      <!-- Email Verification Banner -->
      <EmailVerificationBanner
        @completeProfile="showProfileModal = true"
        @verifyEmail="showEmailVerificationModal = true"
      />

      <!-- View-Only Warning (if not verified) -->
      <div v-if="!isVerified" v-motion="viewOnlyMotion" class="mb-6">
        <OB33ZCard
          class="bg-[rgba(91,63,214,0.1)] border-[rgba(91,63,214,0.3)]"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-[#C9A24D] mb-1">{{ t("viewOnly") }}</h3>
              <p class="text-sm text-[#F4F2ED] opacity-80">
                {{ t("viewOnlyMessage") }}
              </p>
            </div>
            <OB33ZButton
              v-if="!isProfileCompleted"
              variant="secondary"
              class="whitespace-nowrap"
              @click="showProfileModal = true"
            >
              {{ t("completeProfile") }}
            </OB33ZButton>
            <OB33ZButton
              v-else
              variant="secondary"
              class="whitespace-nowrap"
              @click="showEmailVerificationModal = true"
            >
              Verify Email
            </OB33ZButton>
          </div>
        </OB33ZCard>
      </div>

      <!-- Lane Selection -->
      <div v-motion="laneSelectionMotion" class="mb-6">
        <OB33ZCard>
          <h3 class="text-[#C9A24D] mb-4">{{ t("selectLane") }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="lane in lanes"
              :key="lane.id"
              @click="selectedLane = lane.id"
              :class="[
                'relative p-4 rounded-lg border transition-all',
                selectedLane === lane.id
                  ? 'bg-[rgba(201,162,77,0.1)] border-[#C9A24D] shadow-[0_0_20px_rgba(201,162,77,0.2)]'
                  : 'bg-[rgba(244,242,237,0.02)] border-[rgba(201,162,77,0.15)] hover:border-[rgba(201,162,77,0.3)]',
              ]"
            >
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                  <svg v-if="lane.id === 'deep'" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" 
                    :class="[
                      selectedLane === lane.id
                        ? 'text-[#C9A24D]'
                        : 'text-[#F4F2ED]',
                    ]"
                    stroke="currentColor"
                  >
                    <path d="M5.75016 15.0066C7.34064 15.8224 9.17023 16.0434 10.9092 15.6297C12.6482 15.216 14.1823 14.1948 15.235 12.75C16.2876 11.3053 16.7897 9.53215 16.6506 7.75003C16.5116 5.9679 15.7406 4.29403 14.4767 3.03005C13.2127 1.76607 11.5388 0.995103 9.7567 0.856073C7.97457 0.717044 6.20139 1.2191 4.75668 2.27176C3.31197 3.32443 2.29074 4.85848 1.87702 6.59749C1.46329 8.33649 1.68428 10.1661 2.50016 11.7566L0.833496 16.6732L5.75016 15.0066Z" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg
                    v-else-if="lane.id === 'light'"
                    :class="[
                      'w-5 h-5',
                      selectedLane === lane.id
                        ? 'text-[#C9A24D]'
                        : 'text-[#F4F2ED]',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    :class="[
                      'w-5 h-5',
                      selectedLane === lane.id
                        ? 'text-[#C9A24D]'
                        : 'text-[#F4F2ED]',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span
                    :class="[
                      'font-medium',
                      selectedLane === lane.id
                        ? 'text-[#C9A24D]'
                        : 'text-[#F4F2ED]',
                    ]"
                  >
                    {{ lane.name }}
                  </span>
                </div>
                <p class="text-xs text-[#F4F2ED] opacity-60 text-left">
                  {{ lane.description }}
                </p>
              </div>
            </button>
          </div>
        </OB33ZCard>
      </div>

      <!-- Chat Area -->
      <div v-motion="chatAreaMotion">
        <OB33ZCard>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[#C9A24D]">
              {{ lanes.find((l) => l.id === selectedLane)?.name }}
            </h3>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" />
              <span class="text-sm text-[#F4F2ED] opacity-60">
                {{ messages[selectedLane].length + 12 }} active
              </span>
            </div>
          </div>

          <!-- Messages -->
          <div class="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            <div
              v-for="msg in messages[selectedLane]"
              :key="msg.id"
              v-motion="{
                initial: { opacity: 0, x: -20 },
                enter: {
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.1 },
                },
              }"
              :class="['flex gap-3', !isVerified && 'opacity-50']"
            >
              <div
                class="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#5B3FD6] flex items-center justify-center text-[#0B0B0D] font-medium flex-shrink-0"
              >
                {{ msg.user[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-[#F4F2ED]">{{
                    msg.user
                  }}</span>
                  <OB33ZBadge v-if="msg.verified" type="verified" />
                  <OB33ZBadge v-if="msg.vip" type="vip" />
                </div>
                <p class="text-sm text-[#F4F2ED] opacity-90">{{ msg.text }}</p>
                <div v-if="isVerified" class="flex items-center gap-3 mt-2">
                  <button
                    class="flex items-center gap-1 text-[#F4F2ED] opacity-50 hover:opacity-100 hover:text-[#C9A24D] transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                    <span class="text-xs">{{ t("sendGift") }}</span>
                  </button>
                  <button
                    class="flex items-center gap-1 text-[#F4F2ED] opacity-50 hover:opacity-100 hover:text-[#C9A24D] transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span class="text-xs">{{ t("boost") }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div v-if="isVerified" class="flex gap-3">
            <OB33ZInput
              v-model="message"
              :placeholder="t('sendMessage')"
              class="flex-1"
              @keypress="handleKeyPress"
            />
            <OB33ZButton @click="handleSendMessage" class="px-4">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </OB33ZButton>
          </div>
          <div
            v-else
            class="bg-[rgba(244,242,237,0.05)] rounded-lg p-4 text-center"
          >
            <svg class="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.4">
              <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#F4F2ED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#F4F2ED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
            </svg>
            <p class="text-sm text-[#F4F2ED] opacity-60">
              Verification required to participate
            </p>
          </div>
        </OB33ZCard>
      </div>

      <!-- Speed Round Promotion -->
      <div v-motion="speedRoundMotion" class="mt-6">
        <OB33ZCard
          :glow="true"
          class="bg-gradient-to-r from-[rgba(91,63,214,0.1)] to-[rgba(201,162,77,0.1)]"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-[#C9A24D] mb-1">Speed Round Starting Soon</h3>
              <p class="text-sm text-[#F4F2ED] opacity-80">
                Quick conversations, instant connections. Join in 15 minutes!
              </p>
            </div>
            <OB33ZButton variant="primary"> Set Reminder </OB33ZButton>
          </div>
        </OB33ZCard>
      </div>
    </div>

    <!-- Complete Profile modal -->
    <ProfileCompletionModal
      :isOpen="showProfileModal"
      @close="showProfileModal = false"
      @complete="handleProfileComplete"
    />

    <!-- Email Verification Modal -->
    <EmailVerificationModal
      :isOpen="showEmailVerificationModal"
      :userEmail="authStore.user?.email || ''"
      @close="showEmailVerificationModal = false"
      @skip="showEmailVerificationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "#imports";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const authStore = useAuthStore();

type Lane = "deep" | "light" | "social";

interface Message {
  id: string;
  user: string;
  text: string;
  verified: boolean;
  vip?: boolean;
}

const selectedLane = ref<Lane>("light");
const message = ref("");
const showProfileModal = ref(false);
const showEmailVerificationModal = ref(false);

// Check if user is verified from auth store
const isVerified = computed(() => {
  return authStore.user?.is_verified === true || authStore.user?.email_verified_at !== null;
});

// Check if profile is completed
const isProfileCompleted = computed(() => {
  return authStore.user?.profile_completed === true;
});

const messages = ref<Record<Lane, Message[]>>({
  deep: [
    {
      id: "1",
      user: "Jordan",
      text: "What drives your passion in life?",
      verified: true,
      vip: true,
    },
    {
      id: "2",
      user: "Chen",
      text: "I find meaning through creating and connecting with others",
      verified: true,
    },
  ],
  light: [
    {
      id: "1",
      user: "Isabella",
      text: "Anyone watching the game tonight?",
      verified: true,
    },
    {
      id: "2",
      user: "Marcus",
      text: "Yes! Should be a great match",
      verified: true,
    },
    {
      id: "3",
      user: "Sofia",
      text: "Count me in! 🎉",
      verified: true,
    },
  ],
  social: [
    {
      id: "1",
      user: "Alexandra",
      text: "New here! Everyone is so welcoming",
      verified: true,
      vip: true,
    },
    {
      id: "2",
      user: "David",
      text: "Welcome! Glad to have you",
      verified: true,
    },
  ],
});

const lanes = [
  {
    id: "deep" as Lane,
    name: t("deepChat"),
    description: "Meaningful conversations and deep connections",
  },
  {
    id: "light" as Lane,
    name: t("lightChat"),
    description: "Casual chat and everyday topics",
  },
  {
    id: "social" as Lane,
    name: t("friendlySocial"),
    description: "Social mingling and friendly banter",
  },
];

const handleSendMessage = () => {
  if (!message.value.trim() || !isVerified.value) return;

  const newMessage: Message = {
    id: Date.now().toString(),
    user: "You",
    text: message.value,
    verified: true,
  };

  messages.value[selectedLane.value].push(newMessage);
  message.value = "";
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleSendMessage();
};

const handleProfileComplete = async (profileData: {
  displayName: string;
  bio: string;
  city: string;
  state: string;
  birthday: string;
  phone_number: string;
  profileImages: File[];
}) => {
  try {
    // Calculate age from birthday if provided
    let age: string | undefined = undefined;
    if (profileData.birthday) {
      try {
        const birthDate = new Date(profileData.birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        age = String(calculatedAge);
      } catch (e) {
        console.error('Error calculating age:', e);
      }
    }

    // Call profile update API with all fields including profile photos
    await authStore.updateProfile({
      display_name: profileData.displayName,
      age: age,
      city: profileData.city,
      state: profileData.state,
      bio: profileData.bio || undefined,
      phone_number: profileData.phone_number || undefined,
      interests: undefined, // Can be added later if needed
      profile_photos: profileData.profileImages, // Now passing the uploaded images
    });

    // Close profile modal
    showProfileModal.value = false;

    // Open email verification modal after profile is completed
    setTimeout(() => {
      showEmailVerificationModal.value = true;
    }, 300);
  } catch (error: any) {
    // Error is already handled in authStore
    console.error('Profile update failed:', error);
  }
};

const headerMotion = {
  initial: { opacity: 0, y: -20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easing: "ease-out" },
  },
};

const viewOnlyMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easing: "ease-out" },
  },
};

const laneSelectionMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.5, easing: "ease-out" },
  },
};

const chatAreaMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.5, easing: "ease-out" },
  },
};

const speedRoundMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.5, easing: "ease-out" },
  },
};
</script>
