import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function SalesReportPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [view, setView] = useState("Revenue");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/admin/sales-report?year=${selectedYear}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedYear]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>;

  const monthlyData = data?.months || [];
  const totals = data?.totals || { revenue: 0, orders: 0 };
  const avgOrderValue = data?.avgOrderValue || 0;
  const conversionRate = data?.conversionRate || 0;

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Sales Reports</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Detailed sales data and conversion metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-page)" }}>
            {["Revenue", "Orders", "Conversion"].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${view === v ? "bg-[#2275fc] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{v}</button>
            ))}
          </div>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-4 py-[10px] text-sm font-semibold rounded-xl outline-none focus:border-[#2275fc] transition" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
            {[2024, 2025, 2026].map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {[
          { label: "Total Revenue", value: `FRw ${Math.round(totals.revenue).toLocaleString()}`, change: "+15.3%", icon: "💰" },
          { label: "Total Orders", value: Math.round(totals.orders).toLocaleString(), change: "+12.8%", icon: "📋" },
          { label: "Avg. Order Value", value: `FRw ${Math.round(avgOrderValue).toLocaleString()}`, change: "+4.2%", icon: "🛒" },
          { label: "Conversion Rate", value: `${conversionRate}%`, change: "+0.8%", icon: "📈" },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] p-5 flex items-center gap-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="w-[48px] h-[48px] rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "var(--bg-page)" }}>{s.icon}</div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <span className="text-xs font-semibold text-[#22C55E]">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>{view} Overview — {selectedYear}</h5>
        <div className="flex items-end justify-between gap-1 h-[250px]">
          {monthlyData.map((m, i) => {
            const allValues = monthlyData.map(m => view === "Revenue" ? m.revenue : view === "Orders" ? m.orders : m.conversion);
            const maxVal = Math.max(...allValues, 1);
            const val = view === "Revenue" ? m.revenue : view === "Orders" ? m.orders : m.conversion;
            const pct = (val / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#111] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                  {view === "Revenue" ? `FRw ${Math.round(val).toLocaleString()}` : view === "Orders" ? Math.round(val) : `${val}%`}
                </div>
                <div className="w-full rounded-t-md transition-all duration-300" style={{ height: `${pct}%`, background: view === "Orders" ? "linear-gradient(to top, #22C55E, #86EFAC)" : view === "Conversion" ? "linear-gradient(to top, #8B5CF6, #C4B5FD)" : "linear-gradient(to top, #2275fc, #60A5FA)" }} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
          {months.map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>

      <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Monthly Breakdown</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th className="text-left py-4 px-4 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Month</th>
                <th className="text-right py-4 px-4 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Revenue</th>
                <th className="text-right py-4 px-4 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Orders</th>
                <th className="text-right py-4 px-4 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, i) => {
                const prev = monthlyData[i - 1];
                const growth = prev && prev.revenue ? (((m.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : "—";
                return (
                  <tr key={i} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="py-4 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>{months[i]}</td>
                    <td className="py-4 px-4 text-right font-semibold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(m.revenue).toLocaleString()}</td>
                    <td className="py-4 px-4 text-right" style={{ color: "var(--text-secondary)" }}>{Math.round(m.orders)}</td>
                    <td className="py-4 px-4 text-right font-semibold" style={{ color: growth === "—" ? "var(--text-muted)" : Number(growth) >= 0 ? "#22C55E" : "#FF5200" }}>{growth === "—" ? "—" : `${growth}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
