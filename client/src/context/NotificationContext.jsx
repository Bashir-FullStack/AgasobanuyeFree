/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toast = useCallback((message, type = "info") => {
    const id = ++idRef.current;
    const createdAt = Date.now();
    setNotifications(prev => {
      const next = [...prev, { id, message, type, createdAt }];
      return next.length > 3 ? next.slice(next.length - 3) : next;
    });
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ notifications, toast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
