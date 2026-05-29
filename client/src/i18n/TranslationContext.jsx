import { createContext, useContext, useState, useEffect, useCallback } from "react";
import i18n from "./i18n";

const languages = {
  en: { name: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { name: "French", native: "Français", flag: "🇫🇷", dir: "ltr" },
  rw: { name: "Kinyarwanda", native: "Kinyarwanda", flag: "🇷🇼", dir: "ltr" },
};

const TranslationContext = createContext();

function getLang() {
  try {
    const raw = i18n?.language;
    if (!raw) return "en";
    if (raw.startsWith("fr")) return "fr";
    if (raw.startsWith("rw")) return "rw";
    return "en";
  } catch {
    return "en";
  }
}

export function TranslationProvider({ children }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handle = () => forceUpdate((n) => n + 1);
    try {
      i18n?.on("languageChanged", handle);
      return () => i18n?.off("languageChanged", handle);
    } catch {
      return;
    }
  }, []);

  const lang = getLang();

  const setLang = useCallback((l) => {
    try {
      i18n?.changeLanguage(l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const t = useCallback((key, fallback) => {
    try {
      if (!i18n?.t) return fallback ?? key;
      const val = i18n.t(key);
      return val !== key ? val : (fallback ?? key);
    } catch {
      return fallback ?? key;
    }
  }, []);

  const ctx = { lang, setLang, t, languages, current: languages[lang] || languages.en };

  return (
    <TranslationContext.Provider value={ctx}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) return { lang: "en", setLang: () => {}, t: (k, f) => f || k, languages, current: languages.en };
  return ctx;
}

export default TranslationContext;
