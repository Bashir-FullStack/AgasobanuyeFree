import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function InboxPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/contact-messages`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setMessages(d); setLoading(false); if (d.length > 0) setActiveId(d[0]._id); })
      .catch(() => setLoading(false));
  }, []);

  const active = messages.find((c) => c._id === activeId);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-170px)] min-h-[600px]">
      <div className="flex items-center justify-between mb-[30px]">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Inbox</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Customer messages and inquiries</p>
        </div>
      </div>

      <div className="rounded-[14px] flex h-[calc(100%-70px)] overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
        <div className={`${sidebarOpen ? "w-[340px]" : "w-0"} flex-shrink-0 border-r transition-all duration-300 overflow-hidden`} style={{ borderColor: "var(--border-color)" }}>
          <div className="p-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search messages..." className="w-full pl-[42px] pr-4 py-2.5 text-sm rounded-xl outline-none focus:border-[#2275fc] transition" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-73px)]">
            {messages.length === 0 ? (
              <p className="text-sm text-center py-12" style={{ color: "var(--text-muted)" }}>No messages yet</p>
            ) : (
            messages.map((conv) => (
              <button key={conv._id} type="button" onClick={() => setActiveId(conv._id)} className="w-full text-left p-4 transition-all" style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: activeId === conv._id ? "var(--bg-page)" : "transparent" }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2275fc] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{(conv.name || "?").charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{conv.name || "Anonymous"}</p>
                      <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted)" }}>{conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{conv.subject}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{conv.message}</p>
                  </div>
                </div>
              </button>
            ))
            )}
          </div>
        </div>

        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border-r hover:bg-[var(--bg-page)] transition self-stretch" style={{ borderColor: "var(--border-color)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        {active && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2275fc] flex items-center justify-center text-white text-sm font-bold">{(active.name || "?").charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{active.name || "Anonymous"}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{active.email}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: "var(--bg-page)" }}>
              <div className="max-w-[70%] rounded-[14px] px-4 py-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>{active.message}</p>
                <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>{active.createdAt ? new Date(active.createdAt).toLocaleString() : ""}</p>
              </div>
              {active.subject && (
                <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                  <strong>Subject:</strong> {active.subject}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
