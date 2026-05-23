import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("30 Days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-40 skeleton rounded-lg" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-80 skeleton rounded-2xl" />
        <div className="h-80 skeleton rounded-2xl" />
      </div>
    </div>
  );

  const stats = data?.stats || {};
  const browsers = data?.browsers || [];
  const pages = data?.pages || [];
  const referrers = data?.referrers || [];

  const statCards = [
    { label: "Total Users", value: (stats.totalUsers || 0).toLocaleString(), change: "+12.5%", icon: "users" },
    { label: "Total Orders", value: (stats.totalOrders || 0).toLocaleString(), change: "+8.2%", icon: "orders" },
    { label: "Total Products", value: (stats.totalProducts || 0).toLocaleString(), change: "+5.3%", icon: "products" },
    { label: "Total Revenue", value: `FRw ${Math.round(stats.totalRevenue || 0).toLocaleString()}`, change: "+6.7%", icon: "revenue" },
  ];

  const statIcons = {
    users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    orders: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    products: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    revenue: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Website traffic and user behavior insights</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-page)" }}>
          {["7 Days", "30 Days", "90 Days"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === t
                ? "bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--bg-page)", color: "#2275fc" }}>
              {statIcons[s.icon]}
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <span className="text-xs font-semibold text-emerald-500">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Visitors Overview</h5>
          <div className="flex items-end justify-between gap-1 h-[200px]">
            {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 50, 88, 62].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80" style={{
                  height: `${h}%`,
                  background: i % 2 === 0 ? "#2275fc" : "var(--border-color)"
                }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Browser Breakdown</h5>
          <div className="space-y-4">
            {browsers.map((b) => (
              <div key={b.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{b.name}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{b.percentage}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${b.percentage}%`, backgroundColor: b.color || "#2275fc" }} />
                </div>
              </div>
            ))}
            {browsers.length === 0 && <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>No browser data</p>}
          </div>
          <div className="mt-6 pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
            <h6 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Top Referrers</h6>
            <div className="space-y-3">
              {referrers.map((ref) => (
                <div key={ref.source} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>{ref.source}</span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{ref.visitors.toLocaleString()} <span className="text-xs text-emerald-500">{ref.change}</span></span>
                </div>
              ))}
              {referrers.length === 0 && <p className="text-sm py-3 text-center" style={{ color: "var(--text-muted)" }}>No referrer data</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Top Pages</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th className="text-left py-4 px-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Page</th>
                <th className="text-left py-4 px-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Views</th>
                <th className="text-left py-4 px-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.page} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="py-4 px-3 font-semibold" style={{ color: "var(--text-primary)" }}>{p.page}</td>
                  <td className="py-4 px-3" style={{ color: "var(--text-secondary)" }}>{p.views.toLocaleString()}</td>
                  <td className="py-4 px-3 font-semibold" style={{ color: p.change?.startsWith("+") ? "#22C55E" : "#FF5200" }}>{p.change}</td>
                </tr>
              ))}
              {pages.length === 0 && <tr><td colSpan={3} className="py-8 text-center" style={{ color: "var(--text-muted)" }}>No page data</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
