import { useI18n } from "#imports";
import { computed } from "vue";

/**
 * Composable that matches the React LanguageContext API
 * Provides the same interface as the React useLanguage hook
 */
export const useLanguage = () => {
  const { locale, setLocale, t: i18nT } = useI18n();

  /**
   * Translation function that matches React LanguageContext.t()
   * Supports {variable} interpolation (Vue i18n native format)
   */
  const t = (
    key: string,
    params?: Record<string, string | number>
  ): string => {
    // Use Vue i18n's native interpolation with {variable} syntax
    return i18nT(key, params || {});
  };

  /**
   * Set language (matching React context API)
   */
  const setLanguage = (lang: "en" | "es") => {
    setLocale(lang);
  };

  return {
    // Keep this reactive so UI updates when locale changes
    language: computed(() => locale.value as "en" | "es"),
    setLanguage,
    t,
  };
};
