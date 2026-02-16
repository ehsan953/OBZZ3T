<template>
  <div class="relative min-h-screen p-6">
    <LevelNavigation />
    <LiveCounter />
    <MusicToggle />

    <!-- Ambient background effects -->
    <div class="fixed inset-0 pointer-events-none">
      <div
        class="absolute top-1/3 right-1/4 w-96 h-96 bg-[#5B3FD6] opacity-5 blur-[120px] rounded-full"
      />
      <div
        class="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#5B3FD6] opacity-5 blur-[120px] rounded-full"
      />
    </div>

    <div class="relative max-w-7xl mx-auto pt-20">
      <!-- Header -->
      <div
        v-motion="headerMotion"
        class="text-center mb-12"
      >
        <h1 class="text-4xl text-[#C9A24D] mb-2">{{ t("theLounge") }}</h1>
        <p class="text-[#F4F2ED] opacity-70">{{ t("loungeDescription") }}</p>
      </div>

      <!-- Announcement Banner -->
      <div v-motion="announcementMotion" class="mb-8">
        <OB33ZCard :glow="true">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" />
            <div>
              <h3 class="text-[#C9A24D] mb-1">{{ t("announcements") }}</h3>
              <p class="text-sm text-[#F4F2ED] opacity-80">
                New Speed Round starting in The Vibe Room at 9 PM EST. Grand
                prize: 1000 points!
              </p>
            </div>
          </div>
        </OB33ZCard>
      </div>

      <!-- Email Verification Banner (if logged in but not verified) -->
      <EmailVerificationBanner
        v-if="!isGuest"
        @completeProfile="() => {}"
        @verifyEmail="showEmailVerificationModal = true"
      />

      <!-- Guest Banner -->
      <div v-if="isGuest" v-motion="guestBannerMotion" class="mb-8">
        <OB33ZCard
          class="bg-gradient-to-r from-[rgba(91,63,214,0.15)] to-[rgba(201,162,77,0.15)] border-[rgba(201,162,77,0.3)]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in w-6 h-6 text-[#C9A24D]"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>
              <div>
                <h3 class="text-[#F4F2ED] font-medium mb-1">
                  Join OB33Z to unlock full access
                </h3>
                <p class="text-sm text-[#F4F2ED] opacity-80">
                  {{ t("nav.freeAccess") }}
                </p>
              </div>
            </div>
            <div class="flex gap-3">
              <OB33ZButton variant="ghost" @click="openJoinModal">
                {{ t("nav.signIn") }}
              </OB33ZButton>
              <OB33ZButton variant="primary" @click="openJoinModal">
                {{ t("nav.join") }}
              </OB33ZButton>
            </div>
          </div>
        </OB33ZCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Chat Area -->
        <div class="lg:col-span-2">
          <OB33ZCard>
            <h3 class="text-[#C9A24D] mb-4">{{ t("activeNow") }}</h3>

            <!-- Messages -->
            <div class="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
              <div
                v-for="msg in messages"
                :key="msg.id"
                v-motion="{
                  initial: { opacity: 0, x: -20 },
                  enter: {
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.1 },
                  },
                }"
                class="flex gap-3"
              >
                <div
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A24D] to-[#5B3FD6] flex items-center justify-center text-[#0B0B0D] font-medium"
                >
                  {{ msg.user[0] }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-[#F4F2ED]">{{
                      msg.user
                    }}</span>
                    <OB33ZBadge v-if="msg.verified" type="verified" />
                    <OB33ZBadge v-if="msg.vip" type="vip" />
                  </div>
                  <p class="text-sm text-[#F4F2ED] opacity-90">{{ msg.text }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <button
                      class="text-[#F4F2ED] opacity-50 hover:opacity-100 hover:text-[#C9A24D] transition-colors"
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-[#F4F2ED] opacity-50 hover:opacity-100 hover:text-[#C9A24D] transition-colors"
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
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-[#F4F2ED] opacity-50 hover:opacity-100 hover:text-[#C9A24D] transition-colors"
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
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="flex gap-3">
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

            <!-- Actions Bar -->
            <div
              class="flex items-center gap-4 mt-4 pt-4 border-t border-[rgba(201,162,77,0.15)]"
            >
              <button
                class="flex items-center gap-2 text-[#F4F2ED] hover:text-[#C9A24D] transition-colors"
              >
                <svg
                  class="w-5 h-5"
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
                <span class="text-sm">{{ t("sendGift") }}</span>
              </button>
              <button
                class="flex items-center gap-2 text-[#F4F2ED] hover:text-[#C9A24D] transition-colors"
              >
                <svg
                  class="w-5 h-5"
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
                <span class="text-sm">{{ t("boost") }}</span>
              </button>
            </div>
          </OB33ZCard>
        </div>

        <!-- Leaderboard -->
        <div>
          <OB33ZCard>
            <h3 class="text-[#C9A24D] mb-4">{{ t("leaderboard") }}</h3>
            <p class="text-xs text-[#F4F2ED] opacity-60 mb-4">
              {{ t("topMembers") }}
            </p>

            <div class="space-y-3">
              <div
                v-for="entry in leaderboard"
                :key="entry.rank"
                v-motion="{
                  initial: { opacity: 0, x: 20 },
                  enter: {
                    opacity: 1,
                    x: 0,
                    transition: { delay: entry.rank * 0.1 },
                  },
                }"
                class="flex items-center gap-3 p-3 rounded-lg bg-[rgba(244,242,237,0.02)] hover:bg-[rgba(244,242,237,0.05)] transition-colors"
              >
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    entry.rank === 1
                      ? 'bg-[#C9A24D] text-[#0B0B0D]'
                      : entry.rank === 2
                      ? 'bg-[rgba(201,162,77,0.6)] text-[#0B0B0D]'
                      : entry.rank === 3
                      ? 'bg-[rgba(201,162,77,0.3)] text-[#F4F2ED]'
                      : 'bg-[rgba(244,242,237,0.1)] text-[#F4F2ED]',
                  ]"
                >
                  {{ entry.rank }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-[#F4F2ED] truncate">{{
                      entry.user
                    }}</span>
                    <OB33ZBadge v-if="entry.verified" type="verified" />
                    <OB33ZBadge v-if="entry.vip" type="vip" />
                  </div>
                  <span class="text-xs text-[#F4F2ED] opacity-60">{{
                    entry.points.toLocaleString()
                  }}
                    pts</span>
                </div>
              </div>
            </div>
          </OB33ZCard>
        </div>
      </div>
    </div>

    <Join v-model="isJoinOpen" />

    <!-- Email Verification Modal -->
    <EmailVerificationModal
      :isOpen="showEmailVerificationModal"
      :userEmail="authStore.user?.email || ''"
      @close="showEmailVerificationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "#imports";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const authStore = useAuthStore();

const isGuest = computed(() => !authStore.isAuthenticated);
const isJoinOpen = ref(false);
const showEmailVerificationModal = ref(false);
const message = ref("");

interface Message {
  id: string;
  user: string;
  text: string;
  verified: boolean;
  vip?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  points: number;
  verified: boolean;
  vip?: boolean;
}

const messages = ref<Message[]>([
  {
    id: "1",
    user: "Alexandra",
    text: "Welcome to The Lounge everyone! Great energy tonight.",
    verified: true,
    vip: true,
  },
  {
    id: "2",
    user: "Marcus",
    text: "First time here, loving the vibe already",
    verified: true,
  },
  {
    id: "3",
    user: "Sofia",
    text: "The new leaderboard feature is amazing!",
    verified: false,
  },
]);

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, user: "Alexandra", points: 2847, verified: true, vip: true },
  { rank: 2, user: "Jordan", points: 2156, verified: true, vip: true },
  { rank: 3, user: "Marcus", points: 1893, verified: true },
  { rank: 4, user: "Isabella", points: 1647, verified: true },
  { rank: 5, user: "Chen", points: 1432, verified: true },
];

const handleSendMessage = () => {
  if (!message.value.trim()) return;

  const newMessage: Message = {
    id: Date.now().toString(),
    user: "You",
    text: message.value,
    verified: true,
  };

  messages.value.push(newMessage);
  message.value = "";
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === "Enter") handleSendMessage();
};

const openJoinModal = () => {
  isJoinOpen.value = true;
};

const headerMotion = {
  initial: { opacity: 0, y: -20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easing: "ease-out" },
  },
};

const announcementMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.5, easing: "ease-out" },
  },
};

const guestBannerMotion = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.5, easing: "ease-out" },
  },
};
</script>
