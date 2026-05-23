import { useState, useRef, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { useTranslation } from "../i18n/TranslationContext";

export default function LanguageSwitcher({ variant = "default" }) {
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

  const renderMenu = () => (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      <div className="absolute top-full right-0 mt-1 bg-white shadow-xl border border-gray-100 rounded-xl py-1 z-20 min-w-[140px]">
        {Object.entries(languages).map(([code, info]) => (
          <button
            key={code}
            onClick={() => { setLang(code); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition ${
              lang === code ? "text-[#2275fc] bg-[#EEF5FF]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{info.flag}</span>
            <span>{info.native}</span>
            {lang === code && <span className="ml-auto text-[#2275fc]">✓</span>}
          </button>
        ))}
      </div>
    </>
  );

  if (variant === "minimal") {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg hover:bg-black/5 transition-all"
          title={languages[lang]?.name}
        >
          <FiGlobe size={14} />
          <span>{languages[lang]?.native || "EN"}</span>
        </button>
        {open && renderMenu()}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 transition hover:bg-gray-50 text-xs font-medium"
      >
        <FiGlobe size={15} />
        <span>{languages[lang]?.flag}</span>
        <span>{languages[lang]?.native}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1.5 bg-white shadow-xl border border-gray-100 rounded-xl py-1.5 z-20 min-w-[160px]">
            {Object.entries(languages).map(([code, info]) => (
              <button
                key={code}
                onClick={() => { setLang(code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition ${
                  lang === code ? "text-[#2275fc] bg-[#EEF5FF]" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{info.flag}</span>
                <div className="text-left">
                  <span className="block text-sm font-medium">{info.native}</span>
                  <span className="block text-[10px] text-gray-400">{info.name}</span>
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
