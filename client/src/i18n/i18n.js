import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import fr from "./fr.json";
import rw from "./rw.json";

try {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
        rw: { translation: rw },
      },
      fallbackLng: "en",
      keySeparator: false,
      initImmediate: false,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
       lookupLocalStorage: "hiromart_lang",
      },
    });
} catch (e) {
  console.error("i18n init failed:", e);
}

export default i18n;
