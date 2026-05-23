import { useState, useEffect } from "react";
import { API } from "../config";
import { FiX, FiAlertCircle, FiInfo, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const iconMap = {
  info: FiInfo,
  warning: FiAlertTriangle,
  success: FiCheckCircle,
  danger: FiAlertCircle,
};

const colorMap = {
  info: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: "text-blue-500" },
  warning: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: "text-amber-500" },
  success: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "text-emerald-500" },
  danger: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: "text-red-500" },
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("hiromart_dismissed_announcements") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    fetch(`${API}/announcements?active=true`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : d.announcements || [];
        setAnnouncements(list);
      })
      .catch(() => {});
  }, []);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try { localStorage.setItem("hiromart_dismissed_announcements", JSON.stringify(next)); } catch {}
  };

  const visible = announcements.filter(a => !dismissed.includes(a._id || a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {visible.map((a) => {
        const colors = colorMap[a.type] || colorMap.info;
        const Icon = iconMap[a.type] || iconMap.info;
        return (
          <div key={a._id || a.id} className={`flex items-start gap-3 px-4 py-2.5 border-b ${colors.bg} ${colors.text}`}>
            <Icon size={16} className={`mt-0.5 shrink-0 ${colors.icon}`} />
            <div className="flex-1 min-w-0 text-sm">
              {a.title && <span className="font-semibold">{a.title}: </span>}
              <span>{a.message}</span>
            </div>
            <button onClick={() => dismiss(a._id || a.id)} className="shrink-0 p-0.5 rounded hover:bg-black/5 transition opacity-60 hover:opacity-100">
              <FiX size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
