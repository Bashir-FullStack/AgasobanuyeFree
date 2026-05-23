export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: "var(--border-color)" }}>
      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold disabled:opacity-30 hover:bg-[var(--bg-page)] transition-all" style={{ color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {start > 1 && <span className="w-8 h-8 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>...</span>}
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
            p === page
              ? "bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white shadow-md shadow-[#2275fc]/20"
              : "hover:bg-[var(--bg-page)]"
          }`} style={{ color: p === page ? "white" : "var(--text-secondary)" }}>
            {p}
          </button>
        ))}
        {end < totalPages && <span className="w-8 h-8 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>...</span>}
        <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold disabled:opacity-30 hover:bg-[var(--bg-page)] transition-all" style={{ color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}
