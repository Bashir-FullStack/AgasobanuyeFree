import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function MessagesPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/contact-messages`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setMessages(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`${API}/admin/contact-messages/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setMessages(messages.filter(m => m._id !== id));
  };

  const todayMessages = messages.filter(m => {
    if (!m.createdAt) return false;
    return new Date(m.createdAt).toDateString() === new Date().toDateString();
  });

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Messages</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Contact form submissions from the website</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {[
          { label: "Total Messages", value: messages.length, icon: "✉️", bg: "#EEF5FF" },
          { label: "Today", value: todayMessages.length, icon: "📥", bg: "#F0FDF4" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[14px] p-6 flex items-center gap-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: stat.bg }}>{stat.icon}</div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="rounded-[14px] overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          {messages.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <p className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>No messages yet</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Contact form submissions will appear here.</p>
            </div>
          ) : (
            <div>
              {messages.map((m) => (
                <div key={m._id} className="p-5 hover:bg-[var(--bg-page)] transition" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{m.name || "Anonymous"}</p>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.email || ""}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{m.subject}</p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{m.message}</p>
                      <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</p>
                    </div>
                    <button onClick={() => handleDelete(m._id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex-shrink-0">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
