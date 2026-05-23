import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function CustomerReportsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("30 Days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/customer-reports`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>;

  const stats = data?.stats || {};
  const regions = data?.regions || [];
  const retention = data?.retention || [];

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Customer Reports</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Analyze customer growth and behavior</p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{ backgroundColor: "var(--bg-page)" }}>
          {["7 Days", "30 Days", "90 Days", "Year"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === t ? "bg-[#2275fc] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {[
          { label: "Total Customers", value: (stats.total || 0).toLocaleString(), change: "+12.5%", icon: "👥" },
          { label: "Active Customers", value: (stats.activeUsers || 0).toLocaleString(), change: "+8.2%", icon: "✨" },
          { label: "Inactive Customers", value: (stats.inactiveUsers || 0).toLocaleString(), change: "-2.1%", icon: "😴" },
          { label: "New This Month", value: (stats.newThisMonth || 0).toLocaleString(), change: "+7.1%", icon: "💰" },
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
        <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Customer Growth</h5>
          <div className="flex items-end justify-between gap-1 h-[200px]">
            {[30, 45, 38, 60, 50, 75, 65, 85, 70, 90, 82, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t-md transition-all duration-300" style={{ height: `${h}%`, background: "linear-gradient(to top, #2275fc, #60A5FA)" }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Geographic Distribution</h5>
          <div className="space-y-4">
            {regions.map((r) => (
              <div key={r.country}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{r.flag} {r.country}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{r.percentage}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
                  <div className="h-full rounded-full bg-[#2275fc] transition-all" style={{ width: `${r.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <h5 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Customer Retention</h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th className="text-left py-4 px-3 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Cohort</th>
                <th className="text-center py-4 px-3 text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>Retention Rate</th>
              </tr>
            </thead>
            <tbody>
              {retention.map((row) => (
                <tr key={row.cohort} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="py-4 px-3 font-semibold" style={{ color: "var(--text-primary)" }}>{row.cohort}</td>
                  <td className="py-4 px-3 text-center font-semibold" style={{ color: "#22C55E" }}>{row.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
