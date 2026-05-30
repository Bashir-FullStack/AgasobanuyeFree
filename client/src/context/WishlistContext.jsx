import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

import { API } from "../config";
const WishlistContext = createContext();

function loadWishlist() {
  try {
    const saved = localStorage.getItem("agasobanuye_wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function WishlistProvider({ children }) {
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
      fetch(`${API}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => { if (r.ok) return r.json(); throw new Error(); })
        .then(data => setItems(data))
        .catch(() => setItems(loadWishlist()));
    } else {
      setItems(loadWishlist());
    }
    setInitialized(true);
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!initialized) return;
    if (!isLoggedIn || !token) {
      localStorage.setItem("agasobanuye_wishlist", JSON.stringify(items));
    }
  }, [items, initialized, isLoggedIn, token]);

  const showToast = useCallback((product, action) => {
    setToast({ product, action, id: Date.now() });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const toggle = useCallback((product) => {
    const pid = product.id || product._id;
    setItems(prev => {
      const exists = prev.find(i => (i.id || i._id) === pid);
      if (exists) {
        showToast(product, "Removed from wishlist");
        if (isLoggedIn && token) {
          fetch(`${API}/wishlist/${pid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }
        return prev.filter(i => (i.id || i._id) !== pid);
      }
      showToast(product, "Added to wishlist");
      const entry = {
        id: pid, _id: pid,
        name: product.name, image: product.image, price: product.price,
        brand: product.brand, oldPrice: product.oldPrice,
        rating: product.rating, reviews: product.reviews,
      };
      if (isLoggedIn && token) {
        fetch(`${API}/wishlist`, {
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
      fetch(`${API}/wishlist/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [isLoggedIn, token]);

  const inWishlist = useCallback((id) => {
    return items.some(i => (i.id || i._id) === id);
  }, [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, inWishlist, count: items.length }}>
      {children}
      {toast && (
        <div key={toast.id} className="fixed top-20 right-5 z-[9999] max-w-sm w-full animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-rose-500 overflow-hidden flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              <img src={toast.product.image} alt="" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{toast.product.name}</p>
              <p className="text-xs text-rose-600 font-medium">{toast.action}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-500 transition shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
