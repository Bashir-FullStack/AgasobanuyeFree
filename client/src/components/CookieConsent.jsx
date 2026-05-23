import { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiCheck } from "react-icons/fi";

const COOKIE_KEY = "hiromart_cookie_consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored) {
      try { setConsent(JSON.parse(stored)); } catch { setConsent("accepted"); }
    } else {
      setConsent(null);
    }
  }, []);

  if (consent !== null) return null;

  const acceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify("accepted"));
    setConsent("accepted");
  };

  const rejectAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify("rejected"));
    setConsent("rejected");
  };

  const saveCustom = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
    setConsent(prefs);
  };

  const togglePref = (key) => {
    if (key === "necessary") return;
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    { key: "necessary", label: "Strictly Necessary", desc: "Essential for the website to function properly." },
    { key: "analytics", label: "Analytics & Performance", desc: "Help us understand how visitors interact with our site." },
    { key: "marketing", label: "Marketing & Targeting", desc: "Used to deliver relevant ads and track campaign performance." },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-end justify-center">
      <div className="fixed inset-0 bg-black/20" onClick={rejectAll} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl mx-4 sm:mx-6 overflow-hidden animate-slide-up">
        {!showCustomize ? (
          <div className="p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shrink-0 shadow-lg">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1010 10 4 4 0 01-5-5 4 4 0 01-5-5A10 10 0 0012 2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">🍪 Cookies & Privacy</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of all cookies.{" "}
                  <button onClick={() => setShowCustomize(true)} className="text-primary font-medium hover:underline">Customize Settings</button>
                </p>
              </div>
              <button onClick={rejectAll} className="text-gray-300 hover:text-gray-500 transition shrink-0 mt-1"><FiX size={20} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={acceptAll} className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md">
                Accept All
              </button>
              <button onClick={rejectAll} className="flex-1 sm:flex-none border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition">
                Reject All
              </button>
              <button onClick={() => setShowCustomize(true)} className="text-sm text-gray-400 hover:text-gray-600 font-medium underline underline-offset-2 transition ml-auto sm:ml-0">
                Customize
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Cookie Preferences</h3>
              <button onClick={() => setShowCustomize(false)} className="text-gray-300 hover:text-gray-500 transition"><FiX size={20} /></button>
            </div>
            <div className="space-y-3 mb-6">
              {categories.map(cat => {
                const enabled = prefs[cat.key];
                const locked = cat.key === "necessary";
                return (
                  <div key={cat.key} className={`flex items-start gap-4 p-4 rounded-xl border ${enabled ? "border-green-200 bg-green-50/50" : "border-gray-100 bg-gray-50/50"} transition`}>
                    <button onClick={() => togglePref(cat.key)} disabled={locked} className={`relative w-11 h-6 rounded-full transition shrink-0 mt-0.5 ${enabled ? "bg-green-500" : "bg-gray-300"} ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition ${enabled ? "translate-x-5" : ""}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">{cat.label}</p>
                        {locked && <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Required</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveCustom} className="flex-1 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition shadow-md">
                Save Preferences
              </button>
              <button onClick={acceptAll} className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition">
                Accept All
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}</style>
    </div>
  );
}
