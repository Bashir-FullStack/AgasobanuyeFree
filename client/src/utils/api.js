import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export function useFetch(endpoint, deps = [], token = null, pollInterval = 0) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [poll, setPoll] = useState(0);

  useEffect(() => {
    if (!endpoint) { setData(null); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch(`${API}${endpoint}`, { headers })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [endpoint, token, poll, ...deps]);

  useEffect(() => {
    if (!pollInterval) return;
    const iv = setInterval(() => setPoll(n => n + 1), pollInterval);
    return () => clearInterval(iv);
  }, [pollInterval, endpoint]);

  return { data, loading, error };
}

export default API;
