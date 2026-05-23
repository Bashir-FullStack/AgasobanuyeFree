import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../i18n/TranslationContext";

export default function LanguageSwitcher() {
  const { lang, setLang, languages } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-sm"
        style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}
        title={languages[lang]?.name}
      >
        {languages[lang]?.flag || "🌐"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-dark-2 shadow-xl border rounded-xl py-1.5 z-20 min-w-[160px]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
            {Object.entries(languages).map(([code, info]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition ${
                  lang === code
                    ? "text-[#2275fc] bg-[#2275fc]/10"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)]"
                }`}
              >
                <span className="text-base">{info.flag}</span>
                <div className="text-left">
                  <span className="block text-sm font-medium" style={{ color: lang === code ? "#2275fc" : "var(--text-primary)" }}>{info.native}</span>
                  <span className="block text-[10px]" style={{ color: "var(--text-muted)" }}>{info.name}</span>
                </div>
                {lang === code && (
                  <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2275fc" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
