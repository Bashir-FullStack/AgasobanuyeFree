import { useState } from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";
import { useNotification } from "../context/NotificationContext";

const typeConfig = {
  success: { icon: FiCheckCircle, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  error: { icon: FiXCircle, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  info: { icon: FiInfo, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
};

const toastKeyframes = `
@keyframes ti {from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes to {from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}
`;

export default function ToastContainer() {
  const { notifications, removeToast } = useNotification();
  const [exiting, setExiting] = useState({});

  const handleClose = (id) => {
    setExiting(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setExiting(prev => { const n = { ...prev }; delete n[id]; return n; });
      removeToast(id);
    }, 300);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none",
    }}>
      <style>{toastKeyframes}</style>
      {notifications.map(n => {
        const config = typeConfig[n.type] || typeConfig.info;
        const Icon = config.icon;
        const isExiting = exiting[n.id];

        return (
          <div
            key={n.id}
            style={{
              pointerEvents: "auto",
              animation: isExiting
                ? "to 0.3s ease-in forwards"
                : "ti 0.35s ease-out",
              minWidth: "320px",
              maxWidth: "420px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: "#14141f",
              border: "1px solid #2a2a40",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: config.bg,
            }}>
              <Icon size={18} color={config.color} />
            </div>
            <span style={{
              flex: 1,
              fontSize: "14px",
              fontWeight: 500,
              color: "#fafafa",
              lineHeight: 1.4,
            }}>
              {n.message}
            </span>
            <button
              onClick={() => handleClose(n.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#525252",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.color = "#525252"}
            >
              <FiX size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
