import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function NotificationsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setNotifications(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 skeleton rounded-lg" />
      <div className="h-80 skeleton rounded-2xl" />
    </div>
  );

  const today = notifications.filter(n => n.time === "Today" || n.time === "Just now");
  const yesterday = notifications.filter(n => n.time === "Yesterday");
  const older = notifications.filter(n => n.time !== "Today" && n.time !== "Just now" && n.time !== "Yesterday");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Notifications</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Stay updated with store activity</p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white shadow-sm">{unread} Unread</span>}
          <button onClick={() => navigate("/")} className="px-3.5 py-2 text-xs font-semibold rounded-xl border hover:bg-[var(--bg-page)] transition" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Mark all read</button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No notifications yet</p>
          </div>
        ) : (
          <div>
            {/* Today's notifications */}
            {today.length > 0 && (
              <div className="px-5 pt-5 pb-1">
                <h6 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Today</h6>
              </div>
            )}
            {today.map((n, i) => (
              <NotificationItem key={n._id || i} n={n} navigate={navigate} read={n.read} />
            ))}
            
            {/* Yesterday */}
            {yesterday.length > 0 && (
              <div className="px-5 pt-5 pb-1">
                <h6 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Yesterday</h6>
              </div>
            )}
            {yesterday.map((n, i) => (
              <NotificationItem key={n._id || i} n={n} navigate={navigate} read={n.read} />
            ))}
            
            {/* Older */}
            {older.length > 0 && (
              <div className="px-5 pt-5 pb-1">
                <h6 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Earlier</h6>
              </div>
            )}
            {older.map((n, i) => (
              <NotificationItem key={n._id || i} n={n} navigate={navigate} read={n.read} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ n, navigate, read }) {
  return (
    <div
      onClick={() => navigate(n.link || "#")}
      className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-all hover:bg-[var(--bg-page)]"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      {!read && <span className="w-2 h-2 rounded-full bg-[#2275fc] shrink-0 mt-2" />}
      {read && <span className="w-2 h-2 rounded-full bg-transparent shrink-0 mt-2" />}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--bg-page)" }}>
        {n.icon || "🔔"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{n.title}</p>
          <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>{n.time}</span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{n.desc}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  );
}
