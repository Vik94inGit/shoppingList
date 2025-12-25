import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { csTranslations } from "./locales/cs";
import { enTranslations } from "./locales/en";

const LANGUAGE_STORAGE_KEY = "language";
const SUPPORTED_LANGUAGES = ["cs", "en"];

export const defaultLanguage = "cs";

i18next.use(initReactI18next).init({
  lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || defaultLanguage,
  fallbackNS: "main",
  supportedLngs: SUPPORTED_LANGUAGES,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    cs: csTranslations,
    en: enTranslations,
  },
});

// i18next.on("languageChanged", () => {
//   window.localStorage.set(LANGUAGE_STORAGE_KEY, i18next.language)
// })
