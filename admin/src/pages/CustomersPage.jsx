import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

import { API } from "../config";

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCustomers = (p) => {
    setLoading(true);
    fetch(`${API}/admin/customers?page=${p || page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setCustomers(Array.isArray(d.customers || d) ? (d.customers || d) : []);
        if (d.totalPages) { setTotalPages(d.totalPages); setTotal(d.total); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => { fetchCustomers(1); }, []);

  const filtered = (customers || []).filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-40 skeleton rounded-lg" />
      <div className="h-80 skeleton rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Customers</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{total} customers</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <div className="p-5 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            {["All", "Active", "Inactive"].map((t) => (
              <button key={t} onClick={() => setStatusFilter(t)} className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                statusFilter === t
                  ? "bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white shadow-sm"
                  : "text-[var(--text-secondary)] border"
              }`} style={{ borderColor: "var(--border-color)" }}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="pl-[38px] pr-3.5 py-[11px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition w-56" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Customer</th>
                <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Orders</th>
                <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Spent</th>
                <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
                <th className="text-left py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white text-sm font-bold overflow-hidden shrink-0">
                        {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full object-cover" /> : (c.name?.charAt(0) || "?")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-semibold" style={{ color: "var(--text-primary)" }}>{c.orders || 0}</td>
                  <td className="py-4 px-5 font-semibold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(c.totalSpent || 0).toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      c.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}>{c.status || "Active"}</span>
                  </td>
                  <td className="py-4 px-5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-16 text-center" style={{ color: "var(--text-muted)" }}>No customers found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); fetchCustomers(p); }} />
      </div>
    </div>
  );
}
