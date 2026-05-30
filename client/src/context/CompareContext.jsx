import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

import { API } from "../config";
const CompareContext = createContext();

function loadCompare() {
  try {
    const saved = localStorage.getItem("agasobanuye_compare");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function CompareProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [toast, setToast] = useState(null);
  const initializedRef = useRef(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("agasobanuye_token") : null;

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    if (isLoggedIn && token) {
      fetch(`${API}/compare`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => { if (r.ok) return r.json(); throw new Error(); })
        .then(data => setItems(data))
        .catch(() => setItems(loadCompare()));
    } else {
      setItems(loadCompare());
    }
    setInitialized(true);
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!initialized) return;
    if (!isLoggedIn || !token) {
      localStorage.setItem("agasobanuye_compare", JSON.stringify(items));
    }
  }, [items, initialized, isLoggedIn, token]);

  const showToast = useCallback((product, action) => {
    if (typeof product === "string") {
      setToast({ product: { name: product, image: "" }, action: "", id: Date.now() });
    } else {
      setToast({ product, action, id: Date.now() });
    }
    setTimeout(() => setToast(null), 2500);
  }, []);

  const toggle = useCallback((product) => {
    const pid = product.id || product._id;
    setItems(prev => {
      const exists = prev.find(i => (i.id || i._id) === pid);
      if (exists) {
        showToast(product, "Removed from compare");
        if (isLoggedIn && token) {
          fetch(`${API}/compare/${pid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }
        return prev.filter(i => (i.id || i._id) !== pid);
      }
      if (prev.length >= 4) {
        showToast("Compare limit reached (max 4)", "");
        return prev;
      }
      showToast(product, "Added to compare");
      const entry = {
        id: pid, _id: pid,
        name: product.name, image: product.image, price: product.price,
        brand: product.brand, oldPrice: product.oldPrice,
        rating: product.rating, reviews: product.reviews,
      };
      if (isLoggedIn && token) {
        fetch(`${API}/compare`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: pid }),
        }).catch(() => {});
      }
      return [...prev, entry];
    });
  }, [showToast, isLoggedIn, token]);

  const remove = useCallback((id) => {
    setItems(prev => prev.filter(i => (i.id || i._id) !== id));
    if (isLoggedIn && token) {
      fetch(`${API}/compare/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [isLoggedIn, token]);

  const inCompare = useCallback((id) => {
    return items.some(i => (i.id || i._id) === id);
  }, [items]);

  return (
    <CompareContext.Provider value={{ items, toggle, remove, inCompare, count: items.length }}>
      {children}
      {toast && (
        <div key={toast.id} className="fixed top-28 right-5 z-[9999] max-w-sm w-full animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-blue-500 overflow-hidden flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {toast.product.image ? (
                <img src={toast.product.image} alt="" className="w-full h-full object-contain p-1" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7"/></svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{toast.product.name}</p>
              <p className="text-xs text-blue-600 font-medium">{toast.action}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-500 transition shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
