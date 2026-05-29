const STORAGE_KEY = "hiromart

_search_history";
const MAX = 8;

export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addSearchHistory(query) {
  if (!query || !query.trim()) return;
  try {
    const history = getSearchHistory().filter(q => q.toLowerCase() !== query.trim().toLowerCase());
    history.unshift(query.trim());
    if (history.length > MAX) history.length = MAX;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {}
}

export function clearSearchHistory() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
