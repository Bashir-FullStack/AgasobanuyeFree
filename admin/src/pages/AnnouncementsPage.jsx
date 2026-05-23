import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";

const typeStyles = {
  info: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
  warning: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
  success: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
  danger: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-500 dark:text-red-400" },
};

export default function AnnouncementsPage() {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", type: "info", active: true });

  const fetchAll = () => {
    setLoading(true);
    fetch(`${API}/announcements`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setAnnouncements(Array.isArray(d) ? d : d.announcements || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setForm({ title: "", message: "", type: "info", active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    const url = editing ? `${API}/announcements/${editing}` : `${API}/announcements`;
    const method = editing ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      resetForm();
      fetchAll();
    } catch {}
  };

  const toggleActive = async (id, current) => {
    try {
      await fetch(`${API}/announcements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active: !current }),
      });
      fetchAll();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await fetch(`${API}/announcements/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage store-wide announcements and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          {showForm && (
            <button onClick={resetForm} className="px-4 py-2 text-sm font-semibold rounded-xl hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-secondary)" }}>
              Cancel
            </button>
          )}
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="h-[42px] px-4 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {editing ? "Update" : "New Announcement"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{editing ? "Edit Announcement" : "New Announcement"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" className="w-full px-4 py-2.5 text-sm rounded-xl outline-none focus:border-[#2275fc] transition" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 text-sm rounded-xl outline-none focus:border-[#2275fc] transition" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} placeholder="Announcement message..." className="w-full px-4 py-2.5 text-sm rounded-xl outline-none focus:border-[#2275fc] transition resize-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} required />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#2275fc] focus:ring-[#2275fc]" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Active</span>
            </label>
            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all">
              {editing ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>
      ) : announcements.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No announcements yet</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-sm font-semibold text-[#2275fc] hover:underline">Create your first announcement</button>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const style = typeStyles[a.type] || typeStyles.info;
            return (
              <div key={a._id || a.id} className="rounded-2xl p-5 transition-all hover:shadow-md" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${style.bg} ${style.text}`}>{a.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {a.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{a.title}</h4>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{a.message}</p>
                    {a.createdAt && <p className="text-[10px] mt-2 font-medium" style={{ color: "var(--text-muted)" }}>{new Date(a.createdAt).toLocaleDateString()}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => toggleActive(a._id || a.id, a.active)} className={`p-2 rounded-lg transition ${a.active ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`} title={a.active ? "Deactivate" : "Activate"}>
                      {a.active ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="12" x2="23" y2="12"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      )}
                    </button>
                    <button onClick={() => { setEditing(a._id || a.id); setForm({ title: a.title, message: a.message, type: a.type, active: a.active }); setShowForm(true); }} className="p-2 rounded-lg text-[#2275fc] hover:bg-[#2275fc]/10 transition" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(a._id || a.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
