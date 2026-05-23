import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

import { API } from "../config";

export default function SubscribersPage() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchSubscribers = (p) => {
    setLoading(true);
    fetch(`${API}/admin/subscribers?page=${p || page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setSubscribers(d.subscribers || []);
        if (d.totalPages) { setTotalPages(d.totalPages); setTotal(d.total); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => { fetchSubscribers(1); }, []);

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await fetch(`${API}/admin/subscribers/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchSubscribers(page);
    } catch (err) { alert("Failed to delete"); }
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Subscribers</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{total} email subscribers</p>
        </div>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email..." className="pl-[42px] pr-4 py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition w-72" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-[14px] overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider" style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Subscribed On</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id || s.id} className="hover:bg-[var(--bg-page)] transition" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        </div>
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleDelete(s._id || s.id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1 ml-auto">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg> Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="py-16 text-center" style={{ color: "var(--text-muted)" }}>No subscribers found</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); fetchSubscribers(p); }} />
        </div>
      )}
    </div>
  );
}
