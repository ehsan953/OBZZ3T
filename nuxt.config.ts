import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Tinos:wght@400&display=swap",
        },
      ],
    },
    
  },

  vite: { plugins: [tailwindcss()] },
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
  
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    lazy: false,
    langDir: "locales",
    restructureDir: false,
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Español", file: "es.json" },
    ],
    compilation: { strictMessage: false },
    
  } as any,
} as any);
