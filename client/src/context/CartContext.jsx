import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

import { API } from "../config";
const CartContext = createContext();

function loadCart() {
  try {
    const saved = localStorage.getItem("agasobanuye_cart");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

async function syncLocalCartToServer(token) {
  const local = loadCart();
  if (local.length === 0) return;
  for (const item of local) {
    const pid = item.id || item._id;
    if (!pid) continue;
    try {
      const existingRes = await fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      if (!existingRes.ok) continue;
      const existing = await existingRes.json();
      const found = existing.find(e => (e.id || e._id) === pid);
      if (found) {
        await fetch(`${API}/cart/${pid}`, {
          method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ quantity: Math.max(found.qty || 1, item.qty || 1) }),
        });
      } else {
        await fetch(`${API}/cart`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: pid, quantity: item.qty || 1 }),
        });
      }
    } catch {}
  }
  localStorage.removeItem("agasobanuye_cart");
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const initializedRef = useRef(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("agasobanuye_token") : null;
  const lastLoginState = useRef(isLoggedIn);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const justLoggedIn = isLoggedIn && !lastLoginState.current;
    lastLoginState.current = isLoggedIn;

    if (isLoggedIn && token) {
      (async () => {
        if (justLoggedIn) {
          await syncLocalCartToServer(token);
        }
        try {
          const res = await fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            setItems(data);
          } else {
            setItems(justLoggedIn ? loadCart() : []);
          }
        } catch {
          setItems(justLoggedIn ? loadCart() : []);
        }
        setInitialized(true);
      })();
    } else {
      setItems(loadCart());
      setInitialized(true);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (!initialized) return;
    if (!isLoggedIn || !token) {
      localStorage.setItem("agasobanuye_cart", JSON.stringify(items));
    }
  }, [items, initialized, isLoggedIn, token]);

  const showToast = useCallback((product, action) => {
    setToast({ product, action, id: Date.now() });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    const pid = product.id || product._id;
    setItems(prev => {
      const existing = prev.find(i => (i.id || i._id) === pid);
      if (existing) {
        if (isLoggedIn && token) {
          fetch(`${API}/cart/${pid}`, {
            method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ quantity: existing.qty + qty }),
          }).catch(() => {});
        }
        return prev.map(i => (i.id || i._id) === pid ? { ...i, qty: i.qty + qty } : i);
      }
      if (isLoggedIn && token) {
        fetch(`${API}/cart`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: pid, quantity: qty }),
        }).catch(() => {});
      }
      return [...prev, { id: pid, _id: pid, name: product.name, image: product.image, price: product.price, qty }];
    });
    showToast(product, "Added to cart");
  }, [showToast, isLoggedIn, token]);

  const removeFromCart = useCallback((id) => {
    setItems(prev => prev.filter(i => (i.id || i._id) !== id));
    if (isLoggedIn && token) {
      fetch(`${API}/cart/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [isLoggedIn, token]);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => (i.id || i._id) === id ? { ...i, qty } : i));
    if (isLoggedIn && token) {
      fetch(`${API}/cart/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: qty }),
      }).catch(() => {});
    }
  }, [isLoggedIn, token]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (isLoggedIn && token) {
      fetch(`${API}/cart`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }, [isLoggedIn, token]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
      {toast && (
        <div key={toast.id} className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border-l-4 border-green-500 overflow-hidden flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              <img src={toast.product.image} alt="" className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{toast.product.name}</p>
              <p className="text-xs text-green-600 font-medium">{toast.action}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-300 hover:text-gray-500 transition shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
