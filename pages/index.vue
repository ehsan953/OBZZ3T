<template>
  <div class="p-10 text-center">
    <h1 class="text-4xl font-bold text-[#165dff]">
      {{ $t('home.title1') }}
    </h1>
    <h1 class="text-4xl font-bold text-[#165dff]">
      {{ $t('home.title2') }}
    </h1>
    <p class="mt-4 text-gray-600">
      {{ $t('home.subtitle') }}
    </p>
    <NuxtLink
      to="/about"
      class="mt-6 inline-block text-blue-500 hover:underline"
    >
      {{ $t('home.goAbout') }}
    </NuxtLink>
  </div>
</template>