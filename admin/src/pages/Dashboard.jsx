import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import { API } from "../config";

const StatIcon = ({ type }) => {
  const icons = {
    sales: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    income: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    orders: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    visitors: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    active: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    products: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    revenue: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  };
  return icons[type] || icons.sales;
};

const TrendBadge = ({ trend, percent }) => {
  if (!trend) return <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{percent}</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
      trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"
    }`}>
      {trend === "up" ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
      )}
      {percent}
    </span>
  );
};

const Sparkline = ({ data, color }) => {
  const max = Math.max(...data, 1);
  const h = 40;
  const w = 120;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-50">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good Morning");
    else if (h < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 skeleton rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-80 skeleton rounded-2xl" />
        <div className="h-80 skeleton rounded-2xl" />
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];
  const activities = data?.recentActivity || [];

  const cards = [
    { label: "Total Sales", value: (stats.totalProducts || 0).toLocaleString(), trend: "up", percent: "12.5%", icon: "sales", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
    { label: "Total Revenue", value: `FRw ${(stats.totalRevenue || 0).toLocaleString()}`, trend: "up", percent: "8.3%", icon: "income", color: "#2275fc", bg: "rgba(35,119,252,0.1)" },
    { label: "Orders Paid", value: (stats.paidOrders || 0).toLocaleString(), trend: "", percent: "0.00%", icon: "orders", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
    { label: "Total Users", value: stats.totalUsers ? `${stats.totalUsers}` : "0", trend: "up", percent: "5.2%", icon: "visitors", color: "#FF5200", bg: "rgba(255,82,0,0.1)" },
    { label: "Active Now", value: "142", trend: "up", percent: "12%", icon: "active", color: "#D97706", bg: "rgba(217,119,6,0.1)" },
  ];

  const statusBadge = (status) => {
    const map = {
      "Processing": "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      "Shipped": "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      "Delivered": "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      "Completed": "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      "Pending": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      "Cancelled": "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    };
    return map[status] || "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  };

  const quickActions = [
    { label: "Add Product", href: "/products/new", icon: "product", color: "#22C55E" },
    { label: "View Orders", href: "/orders", icon: "orders", color: "#FF5200" },
    { label: "New Category", href: "/categories/new", icon: "category", color: "#2275fc" },
    { label: "Add Banner", href: "/banners/new", icon: "banner", color: "#8B5CF6" },
    { label: "Analytics", href: "/analytics", icon: "analytics", color: "#D97706" },
    { label: "Coupons", href: "/coupons", icon: "coupon", color: "#EC4899" },
  ];

  const recentActivityData = activities.length > 0 ? activities : [
    { text: "Store opened for business", time: "2 hours ago", icon: "🚀" },
    { text: "Welcome to hiromart admin", time: "Just now", icon: "👋" },
    { text: "Dashboard ready for monitoring", time: "Today", icon: "📊" },
  ];

  const storeOverview = [
    { label: "Total Products", value: (stats.totalProducts || 0).toLocaleString() },
    { label: "Total Orders", value: (stats.totalOrders || 0).toLocaleString() },
    { label: "Total Users", value: (stats.totalUsers || 0).toLocaleString() },
    { label: "Total Revenue", value: `FRw ${(stats.totalRevenue || 0).toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{greeting}! 👋</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems normal
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <div key={c.label} className="group rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: c.bg, color: c.color }}>
                <StatIcon type={c.icon} />
              </div>
              <TrendBadge trend={c.trend} percent={c.percent} />
            </div>
            <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>{c.label}</p>
            <h4 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{c.value}</h4>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between p-5 pb-0">
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Orders</h5>
            <Link to="/orders" className="text-xs flex items-center gap-1 font-semibold text-[#2275fc] hover:underline transition">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Customer</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Product</th>
                    <th className="text-left py-3.5 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
                    <th className="text-right py-3.5 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id || order.id || `${order.userName}-${order.total}-${order.createdAt}`} className="hover:bg-[var(--bg-page)] transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                            {order.userAvatar ? <img src={order.userAvatar} alt="" className="w-full h-full object-cover" /> : (order.userName || "U").charAt(0)}
                          </div>
                          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{order.userName || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5" style={{ color: "var(--text-secondary)" }}>{order.items?.map(i => i.name).join(", ") || "—"}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${statusBadge(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-semibold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(order.total).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products + Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Top Products</h5>
              <Link to="/products" className="text-xs flex items-center gap-1 font-semibold text-[#2275fc] hover:underline transition">
                View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </Link>
            </div>
            <div className="space-y-1">
              {topProducts.map((p, i) => (
                <div key={p._id || p.name || i} className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[var(--bg-page)] transition-colors">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    i === 0 ? "bg-[#2275fc] text-white" : i === 1 ? "bg-[#8B5CF6] text-white" : i === 2 ? "bg-[#D97706] text-white" : ""
                  }`} style={i > 2 ? { backgroundColor: "var(--bg-input)", color: "var(--text-muted)" } : {}}>
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-page)]">
                    <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.reviews} reviews</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(p.price).toLocaleString()}</p>
                    {p.sale && <span className="text-[10px] font-semibold text-emerald-500">{p.sale}</span>}
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>No products yet</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Quick Actions</h5>
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((a) => (
                <Link key={a.href} to={a.href} className="flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group" style={{ borderColor: "var(--border-color)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110" style={{ backgroundColor: `${a.color}15`, color: a.color }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {a.icon === "product" && <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
                      {a.icon === "orders" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
                      {a.icon === "category" && <><path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z"/></>}
                      {a.icon === "banner" && <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>}
                      {a.icon === "analytics" && <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>}
                      {a.icon === "coupon" && <><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></>}
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: "var(--text-secondary)" }}>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Activity</h5>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-secondary)" }}>
              {recentActivityData.length} events
            </span>
          </div>
          <div className="relative">
            {recentActivityData.map((a, i) => (
              <div key={`${a.text}-${a.time}-${i}`} className="flex items-start gap-4 pb-4 relative">
                {i < recentActivityData.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px" style={{ backgroundColor: "var(--border-color)" }} />
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ring-2 ring-white dark:ring-gray-800" style={{ backgroundColor: "var(--bg-page)" }}>
                  {typeof a.icon === "string" ? a.icon : "📌"}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{a.text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === 0 ? "#22C55E" : "var(--text-muted)" }} />
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Overview */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Store Overview</h5>
            <div className="space-y-1">
              {storeOverview.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <span className="text-sm flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Store Health</h5>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Server", status: "Operational", color: "#22C55E", light: "rgba(34,197,94,0.1)" },
                { label: "Database", status: "Connected", color: "#22C55E", light: "rgba(34,197,94,0.1)" },
                { label: "API", status: "Online", color: "#22C55E", light: "rgba(34,197,94,0.1)" },
                { label: "Storage", status: "96% Used", color: "#D97706", light: "rgba(217,119,6,0.1)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ backgroundColor: item.light }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: item.color }}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
