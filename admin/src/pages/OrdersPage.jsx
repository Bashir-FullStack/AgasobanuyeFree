import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

import { API } from "../config";

const statusColor = {
  Processing: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  Shipped: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  Delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  Completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  Cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
};

const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled", "Pending"];

export default function OrdersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchOrders(1); }, []);

  const fetchOrders = (p) => {
    setLoading(true);
    fetch(`${API}/admin/orders?page=${p || page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        setOrders(d.orders || d);
        if (d.totalPages) { setTotalPages(d.totalPages); setTotal(d.total); }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const handleStatusFilter = (t) => {
    setStatusFilter(t);
    setPage(1);
    fetchOrders(1);
  };

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-40 skeleton rounded-lg" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
      </div>
      <div className="h-80 skeleton rounded-2xl" />
    </div>
  );

  const paidOrders = orders.filter(o => o.status !== "Cancelled").length;
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const completedOrders = orders.filter(o => o.status === "Delivered" || o.status === "Completed").length;
  const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const summaryCards = [
    { label: "Total Orders", value: total, color: "#2275fc", bg: "rgba(35,119,252,0.1)" },
    { label: "Paid", value: paidOrders, color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    { label: "Pending", value: pendingOrders, color: "#D97706", bg: "rgba(217,119,6,0.1)" },
    { label: "Cancelled", value: cancelledOrders, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{total} orders &middot; FRw {Math.round(totalRevenue).toLocaleString()} total revenue</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((t) => (
            <button key={t} onClick={() => handleStatusFilter(t)} className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              statusFilter === t
                ? "bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white shadow-sm"
                : "text-[var(--text-secondary)] border"
            }`} style={{ borderColor: "var(--border-color)" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="rounded-2xl p-4 transition-all hover:shadow-md" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.bg, color: c.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {c.label === "Total Orders" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                  {c.label === "Paid" && <><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>}
                  {c.label === "Pending" && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                  {c.label === "Cancelled" && <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>}
                </svg>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.label}</p>
                <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p className="text-lg font-bold mb-1" style={{ color: "var(--text-muted)" }}>No orders yet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Orders will appear here once customers start purchasing.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Order</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Total</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-[var(--bg-page)] transition cursor-pointer" style={{ borderBottom: "1px solid var(--border-color)" }} onClick={() => navigate(`/orders/detail?id=${o._id}`)}>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-xs font-mono" style={{ color: "var(--text-primary)" }}>#{o._id?.toString().slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white text-[10px] font-bold shrink-0 overflow-hidden">
                          {o.user_id?.avatar ? <img src={o.user_id.avatar} alt="" className="w-full h-full object-cover" /> : (o.user_id?.name?.charAt(0) || "?")}
                        </div>
                        <span style={{ color: "var(--text-secondary)" }}>{o.user_id?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(o.total).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusColor[o.status] || "text-[var(--text-secondary)]"}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{o.payment || "—"}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); fetchOrders(p); }} />
        </div>
      )}
    </div>
  );
}
