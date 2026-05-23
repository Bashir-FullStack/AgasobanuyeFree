import { createContext, useContext, useState, useEffect, useMemo } from "react";

const languages = {
  en: { name: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { name: "French", native: "Français", flag: "🇫🇷", dir: "ltr" },
  rw: { name: "Kinyarwanda", native: "Kinyarwanda", flag: "🇷🇼", dir: "ltr" },
};

import en from "./en.json";
import fr from "./fr.json";
import rw from "./rw.json";

const allTranslations = { en, fr, rw };

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem("hiromart_lang") || "en"; }
    catch { return "en"; }
  });

  const flat = useMemo(() => {
    const f = {};
    for (const l of Object.keys(allTranslations)) {
      f[l] = allTranslations[l];
    }
    return f;
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("hiromart_lang", l); } catch {}
    try { document.documentElement.lang = l; } catch {}
  };

  useEffect(() => {
    try { document.documentElement.lang = lang; } catch {}
  }, [lang]);

  const t = (key, fallback) => {
    try {
      const val = flat[lang]?.[key];
      if (val !== undefined) return val;
      const enVal = flat.en?.[key];
      if (enVal !== undefined) return enVal;
    } catch {}
    return fallback || key;
  };

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
