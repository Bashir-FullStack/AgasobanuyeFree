import { useState, useEffect, useCallback } from "react";

let globalVersion = 0;
const listeners = new Set();

export function useRealtime() {
  const [version, setVersion] = useState(globalVersion);

  useEffect(() => {
    const fn = () => setVersion(globalVersion);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);

  return version;
}

export function triggerRefresh() {
  globalVersion++;
  listeners.forEach(fn => fn());
}

// Auto-poll every 30s
if (typeof window !== "undefined") {
  setInterval(() => { triggerRefresh(); }, 30000);
}
