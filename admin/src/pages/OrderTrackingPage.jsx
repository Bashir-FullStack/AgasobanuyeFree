import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function OrderTrackingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/admin/orders/${orderId.trim()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) { setError("Order not found"); setOrder(null); }
      else setOrder(await r.json());
    } catch { setError("Error looking up order"); }
    setLoading(false);
  };

  const steps = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const statusMap = { "Pending": 0, "Processing": 1, "Shipped": 2, "Delivered": 3, "Cancelled": 4 };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Order Tracking</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Track the status of any order</p>
        </div>
        <button onClick={() => navigate("/orders")} className="h-[44px] px-5 border text-sm font-semibold rounded-xl hover:bg-[var(--bg-page)] transition-all flex items-center gap-2" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Orders
        </button>
      </div>

      <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <form onSubmit={handleTrack} className="flex items-center gap-4 max-w-2xl">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Enter Order ID</label>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Paste order ID here..." className="w-full px-[22px] py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <button type="submit" className="mt-[30px] h-[50px] px-6 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Track Order
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {loading && <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>}

      {order && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-[30px]">
            {[
              { label: "Order ID", value: order._id?.toString().slice(-8).toUpperCase() || "—" },
              { label: "Status", value: order.status || "—", color: order.status === "Delivered" ? "#22C55E" : order.status === "Cancelled" ? "#FF5200" : "#2275fc" },
              { label: "Customer", value: order.user_id?.name || "—" },
              { label: "Total", value: `FRw ${Math.round(order.total || 0).toLocaleString()}` },
            ].map((info) => (
              <div key={info.label} className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{info.label}</p>
                <p className="text-lg font-bold" style={{ color: info.color || "var(--text-primary)" }}>{info.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold mb-8" style={{ color: "var(--text-primary)" }}>Tracking Timeline</h5>
            <div className="relative pl-8 before:absolute before:left-[15px] before:top-0 before:bottom-0 before:w-[3px] before:bg-[var(--border-color)]">
              {steps.map((step, i) => {
                const currentIdx = statusMap[order.status] !== undefined ? statusMap[order.status] : -1;
                const done = i <= currentIdx && order.status !== "Cancelled";
                const cancelled = order.status === "Cancelled" && step === "Cancelled";
                return (
                  <div key={step} className={`relative pb-8 last:pb-0 ${cancelled ? "opacity-100" : done ? "opacity-100" : "opacity-40"}`}>
                    <div className={`absolute -left-8 top-0 w-[33px] h-[33px] rounded-full border-4 flex items-center justify-center text-xs font-bold ${
                      cancelled ? "bg-[#FF5200] border-[#FF5200] text-white"
                      : done ? "bg-[#2275fc] border-[#2275fc] text-white"
                      : "bg-white border-[var(--border-color)] text-[var(--text-muted)]"
                    }`}>
                      {cancelled ? "✕" : done ? "✓" : i + 1}
                    </div>
                    <div className="ml-2">
                      <p className={`text-sm font-semibold ${done || cancelled ? "" : "text-[var(--text-muted)]"}`} style={{ color: done || cancelled ? "var(--text-primary)" : undefined }}>{step}</p>
                      <p className={`text-xs mt-0.5 ${done ? "" : "text-[var(--text-muted)]"}`} style={{ color: done ? "var(--text-secondary)" : undefined }}>
                        {done && order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Order Items</h5>
            <div className="space-y-3">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <span style={{ color: "var(--text-primary)" }}>{item.name || `Product #${item.product_id}`} × {item.quantity}</span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
