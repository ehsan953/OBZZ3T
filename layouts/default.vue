<template>
  <div class="relative min-h-screen overflow-hidden bg-[#050608]">
    <!-- Cursor-follow small radial glow -->
    <div
      ref="cursorGlow"
      class="pointer-events-none absolute inset-0 z-[1]"
      style="transition: background 40ms linear"
    />

    <!-- Existing dark overlay -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 z-[2]"
    />

    <!-- Existing purple ambient glow -->
    <div class="pointer-events-none absolute inset-0 z-[2]">
      <div
        class="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5B3FD6]/10 blur-[140px]"
      />
    </div>

    <!-- Language selector -->
    <div class="absolute right-6 top-6 z-20">
      <LanguageSelector />
    </div>

    <!-- Center content -->
    <div
      class="relative z-10 flex min-h-screen items-center justify-center px-6"
    >
      <div class="w-full max-w-md text-center">
        <h1
          class="font-normal text-[72px] leading-[72px] tracking-[3.6px] text-[#C9A24D]"
          style="font-family: 'Tinos', serif"
        >
          OB33Z
        </h1>

        <div class="group inline-block cursor-default">
          <div
            class="mx-auto mt-4 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24D] to-transparent w-20 transition-all duration-300 group-hover:w-44"
          ></div>
        </div>

        <div class="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            @click="isJoinOpen = true"
            class="w-[260px] rounded-lg bg-[#C9A24D] px-6 py-3 text-sm font-semibold tracking-widest text-black shadow-[0_0_0_1px_rgba(201,162,77,0.25),0_18px_40px_rgba(0,0,0,0.55)] transition hover:brightness-110 active:scale-[0.99]"
          >
            {{ t("nav.join") }}
          </button>

          <NuxtLink
            to="/auth/signin"
            class="w-[260px] rounded-lg border border-[#C9A24D]/80 bg-transparent px-6 py-3 text-sm font-semibold tracking-widest text-[#C9A24D] shadow-[0_0_0_1px_rgba(201,162,77,0.10)] transition hover:bg-[#C9A24D]/10 active:scale-[0.99]"
          >
            {{ t("nav.signIn") }}
          </NuxtLink>
        </div>

        <p class="mx-auto mt-10 max-w-xs text-[12px] italic text-white/70">
          {{ t("nav.freeAccess") }}
        </p>
      </div>
    </div>

    <!-- Bottom gold glow -->
    <div
      class="pointer-events-none absolute bottom-0 left-0 right-0 h-[128px] z-[2]"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#C9A24D]/35 via-[#C9A24D]/15 to-transparent blur-[2px]"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
      />
    </div>
    <Join v-model="isJoinOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "#imports";

const { t } = useI18n();
const cursorGlow = ref<HTMLElement | null>(null);
const isJoinOpen = ref(false)

let raf = 0;
let x = 0;
let y = 0;

const onMouseMove = (e: MouseEvent) => {
  x = e.clientX;
  y = e.clientY;

  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    if (!cursorGlow.value) return;

    cursorGlow.value.style.background = `
      radial-gradient(
        180px at ${x}px ${y}px,
        rgba(201,162,77,0.18),
        transparent 70%
      )
    `;
  });
};

onMounted(() => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  window.addEventListener("mousemove", onMouseMove, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMouseMove);
});
</script>
