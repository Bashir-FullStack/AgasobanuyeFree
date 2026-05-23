import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import { API } from "../config";

export default function CouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" });
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => { loadCoupons(); }, []);

  const totalPages = Math.ceil(coupons.length / perPage);
  const paginated = coupons.slice((page - 1) * perPage, page * perPage);

  const loadCoupons = async () => {
    try {
      const res = await fetch(`${API}/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCoupons(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditId(null);
    setForm({ code: "", type: "percentage", value: "", minOrder: "", maxUses: "", expiresAt: "" });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditId(c._id);
    setForm({ code: c.code, type: c.type, value: String(c.value), minOrder: String(c.minOrder || ""), maxUses: String(c.maxUses || ""), expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    const url = editId ? `${API}/admin/coupons/${editId}` : `${API}/admin/coupons`;
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed to save"); return; }
      setShowForm(false);
      loadCoupons();
    } catch (err) { alert("Failed to save coupon"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`${API}/admin/coupons/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      loadCoupons();
    } catch (err) { alert("Failed to delete"); }
  };

  const toggleActive = async (c) => {
    try {
      await fetch(`${API}/admin/coupons/${c._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: !c.active }),
      });
      loadCoupons();
    } catch (err) { alert("Failed to toggle"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Coupons</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{coupons.length} coupons</p>
        </div>
        <button onClick={openNew} className="h-[42px] px-4 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Coupon
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 space-y-5 transition-all" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editId ? "Edit Coupon" : "New Coupon"}</h5>
            <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Code</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="SAVE20" className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Value</label>
              <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} type="number" step="0.01" placeholder={form.type === "percentage" ? "20" : "10.00"} className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Min Order</label>
              <input value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} type="number" step="0.01" placeholder="0" className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Max Uses</label>
              <input value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} type="number" placeholder="Unlimited if empty" className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Expires At</label>
              <input value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} type="date" className="w-full px-4 py-3 text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#2275fc]/20 transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="px-5 py-2.5 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all">Save</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-semibold rounded-xl border hover:bg-[var(--bg-page)] transition" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Code</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Type</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Value</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Min Order</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Used</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Expires</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Active</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c => (
                  <tr key={c._id} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="p-4 font-bold" style={{ color: "var(--text-primary)" }}>{c.code}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        c.type === "percentage"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                      }`}>{c.type}</span>
                    </td>
                    <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{c.type === "percentage" ? `${c.value}%` : `FRw ${(c.value)}`}</td>
                    <td className="p-4" style={{ color: "var(--text-secondary)" }}>{c.minOrder ? `FRw ${c.minOrder}` : "—"}</td>
                    <td className="p-4" style={{ color: "var(--text-secondary)" }}>{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}</td>
                    <td className="p-4" style={{ color: "var(--text-secondary)" }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                    <td className="p-4">
                      <button onClick={() => toggleActive(c)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        c.active
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}>{c.active ? "Active" : "Inactive"}</button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-[#2275fc] text-xs font-semibold hover:underline">Edit</button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs font-semibold hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {coupons.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}
