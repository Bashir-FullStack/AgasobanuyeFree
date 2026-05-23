import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function OrderDetailPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    if (!orderId) return;
    fetch(`${API}/admin/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrder(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const iv = setInterval(fetchOrder, 5000);
    return () => clearInterval(iv);
  }, [orderId]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-16"><p className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>Order not found</p></div>;

  const items = order.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = order.total || subtotal;

  const trackingStatuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  const deliveryStatus = order.delivery?.status || "Pending";
  const currentIdx = trackingStatuses.indexOf(deliveryStatus);
  const trackingNumber = order.delivery?.trackingNumber || order._id?.toString().slice(-8).toUpperCase();

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Order Detail</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>View order #{order._id?.toString().slice(-8).toUpperCase()}</p>
        </div>
        <button onClick={() => navigate("/orders")} className="h-[44px] px-5 border text-sm font-semibold rounded-xl hover:bg-[var(--bg-page)] transition-all flex items-center gap-2" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Orders
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        <div className="xl:col-span-2 space-y-[30px]">
          <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const res = await fetch(`${API}/admin/orders/${orderId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ status: e.target.value }),
                    });
                    if (res.ok) setOrder({ ...order, status: e.target.value });
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border outline-none ${
                    order.status === "Delivered" ? "bg-[#F0FDF4] text-[#22C55E] border-[#22C55E]" :
                    order.status === "Shipped" ? "bg-[#F5F3FF] text-[#8B5CF6] border-[#8B5CF6]" :
                    order.status === "Cancelled" ? "bg-[#F8FAFC] text-[var(--text-muted)] border-gray-200" :
                    order.status === "Confirmed" ? "bg-[#EEF5FF] text-[#2275fc] border-[#2275fc]" :
                    "bg-[#FFF7ED] text-[#F97316] border-[#F97316]"
                  }`}
                >
                  <option value="Processing">Processing</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#2275fc]">Tracking: {trackingNumber}</span>
              <select
                value={deliveryStatus}
                onChange={async (e) => {
                  const res = await fetch(`${API}/admin/orders/${orderId}/tracking`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ status: e.target.value }),
                  });
                  if (res.ok) { setOrder({ ...order, delivery: { ...order.delivery, status: e.target.value } }); fetchOrder(); }
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border outline-none bg-[#EEF5FF] text-[#2275fc] border-[#2275fc]"
              >
                {trackingStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-0">
              {trackingStatuses.map((step, i) => (
                <div key={step} className="flex-1 text-center relative">
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold relative z-10 ${i <= currentIdx ? "bg-[#2275fc] text-white" : "bg-[var(--bg-input)] text-[var(--text-muted)]"}`}>
                    {i <= currentIdx ? "✓" : i + 1}
                  </div>
                  {i < trackingStatuses.length - 1 && <div className={`absolute top-4 left-[60%] right-0 h-[3px] ${i < currentIdx ? "bg-[#2275fc]" : "bg-[var(--border-color)]"}`} />}
                  <p className={`text-[11px] mt-2 font-medium ${i <= currentIdx ? "text-[#2275fc]" : "text-[var(--text-muted)]"}`}>{step}</p>
                </div>
              ))}
            </div>
            {(order.delivery?.updates || []).length > 0 && (
              <div className="mt-3 pt-3 space-y-1" style={{ borderTop: "1px solid var(--border-color)" }}>
                {(order.delivery.updates || []).slice().reverse().map((u, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--text-secondary)" }}><strong>{u.status}</strong>{u.note ? ` — ${u.note}` : ""}</span>
                    <span style={{ color: "var(--text-muted)" }}>{u.date ? new Date(u.date).toLocaleString() : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Order Items</h5>
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-4" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                {item.image ? (
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xs" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>No img</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.name || `Product #${item.product_id}`}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Qty: {item.quantity} × FRw {Math.round(item.price).toLocaleString()}</p>
                </div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-[30px]">
          {(order.user_id || order.name) && (
          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Customer</h5>
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <div className="w-10 h-10 rounded-full bg-[#2275fc] flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                {order.user_id?.avatar ? <img src={order.user_id.avatar} alt="" className="w-full h-full object-cover" /> : ((order.user_id?.name || order.name || "U").charAt(0))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{order.user_id?.name || order.name || "Unknown"}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{order.user_id?.email || order.email || "—"}</p>
              </div>
            </div>
            {(order.user_id?.phone || order.phone) && (
            <div className="flex items-center gap-3 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              <span style={{ color: "var(--text-secondary)" }}>{order.user_id?.phone || order.phone}</span>
            </div>
            )}
          </div>
          )}

          {order.delivery?.province && (
          <div className="rounded-[14px] p-6 space-y-3" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Delivery</h5>
            <div className="text-sm space-y-1">
              <p style={{ color: "var(--text-secondary)" }}>Province: <strong style={{ color: "var(--text-primary)" }}>{order.delivery.province}</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>Sector: <strong style={{ color: "var(--text-primary)" }}>{order.delivery.sector}</strong></p>
              <p style={{ color: "var(--text-secondary)" }}>Price: <strong style={{ color: "var(--text-primary)" }}>FRw {Number(order.delivery.price || 0).toLocaleString()}</strong></p>
            </div>
          </div>
          )}

          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Payment Summary</h5>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-primary)" }}>FRw {Math.round(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(total).toLocaleString()}</span>
              </div>
            </div>
            {order.payment && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Payment: {order.payment}</span>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
