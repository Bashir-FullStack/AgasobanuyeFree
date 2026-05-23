import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hiromart_cookie_consent");
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try { localStorage.setItem("hiromart_cookie_consent", "accepted"); } catch {}
    setVisible(false);
  };

  const reject = () => {
    try { localStorage.setItem("hiromart_cookie_consent", "rejected"); } catch {}
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ animation: "slideUp 0.3s ease-out" }}>
      <div className="fixed inset-0 bg-black/20" onClick={reject} />
      <div className="relative bg-white rounded-2xl shadow-2xl mx-auto max-w-lg p-5">
        <button onClick={reject} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition">
          <FiX size={18} />
        </button>
        <h3 className="text-base font-bold text-gray-900 mb-1">Cookies & Privacy</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          We use cookies to enhance your experience. By accepting, you consent to all cookies.
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
            Accept All
          </button>
          <button onClick={reject}
            className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
