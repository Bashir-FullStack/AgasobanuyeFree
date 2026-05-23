import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

import { API } from "../config";

export default function ProductsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProducts = (p) => {
    setLoading(true);
    fetch(`${API}/admin/products?page=${p || page}&limit=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        setProducts(d.products || d);
        if (d.totalPages) { setTotalPages(d.totalPages); setTotal(d.total); }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  const fetchCategories = () => {
    fetch(`${API}/admin/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCategories);
  };

  useEffect(() => { fetchProducts(1); fetchCategories(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API}/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchProducts(page);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} products?`)) return;
    for (const id of selected) {
      await fetch(`${API}/admin/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    }
    setSelected([]);
    fetchProducts(1);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(p => p.id));
  };

  const toggleOne = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) &&
    (categoryFilter === "All" || p.category === categoryFilter)
  );

  const handlePageChange = (p) => { setPage(p); fetchProducts(p); };

  const switchToCategorized = () => {
    setViewMode("categorized");
    fetch(`${API}/admin/products?page=1&limit=200`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        setProducts(d.products || d);
        if (d.totalPages) { setTotalPages(d.totalPages); setTotal(d.total); }
      });
  };

  const categorizedProducts = {};
  if (viewMode === "categorized") {
    categories.forEach(cat => { categorizedProducts[cat.name] = []; });
    filtered.forEach(p => {
      if (categorizedProducts[p.category]) categorizedProducts[p.category].push(p);
      else categorizedProducts[p.category] = [p];
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{total} products total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1" style={{ backgroundColor: "var(--bg-page)" }}>
            <button onClick={() => setViewMode("table")} className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${viewMode === "table" ? "bg-white dark:bg-dark-2 shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              Table
            </button>
            <button onClick={switchToCategorized} className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${viewMode === "categorized" ? "bg-white dark:bg-dark-2 shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              Categories
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-[38px] pr-3.5 py-[11px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition w-48" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3.5 py-[11px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition cursor-pointer appearance-none pr-8" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <button onClick={() => navigate("/products/new")} className="h-[42px] px-4 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2275fc]/5" style={{ border: "1px solid rgba(35,119,252,0.15)" }}>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selected.length} selected</span>
          <button onClick={handleBulkDelete} className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Delete selected</button>
          <button onClick={() => setSelected([])} className="px-3.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-secondary)" }}>Clear</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>
      ) : viewMode === "categorized" ? (
        <div className="space-y-4">
          {Object.entries(categorizedProducts).sort(([a], [b]) => a.localeCompare(b)).map(([category, catProducts]) => {
            if (catProducts.length === 0) return null;
            return (
              <div key={category} className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2275fc] text-white">{catProducts.length}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left" style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Product</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Brand</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Price</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Stock</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Rating</th>
                        <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-[var(--bg-page)] border" style={{ borderColor: "var(--border-color)" }} />
                              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5" style={{ color: "var(--text-secondary)" }}>{p.brand}</td>
                          <td className="px-5 py-3.5 font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(p.price).toLocaleString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              (p.quantity || 0) > 5 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                              (p.quantity || 0) > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                              "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"
                            }`}>{p.quantity || 0}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-sm">{'★'.repeat(Math.round(p.rating || 0))}{'☆'.repeat(5 - Math.round(p.rating || 0))}</span>
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>({p.reviews || 0})</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => navigate(`/products/detail?id=${p.id}`)} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#2275fc] hover:bg-[#2275fc]/10 transition">Edit</button>
                              <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {Object.values(categorizedProducts).every(arr => arr.length === 0) && (
            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No products found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th className="px-5 py-4 w-10">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-[#2275fc] focus:ring-[#2275fc]" />
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Product</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Brand</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Price</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Stock</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Category</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Rating</th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg-page)] transition-colors" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleOne(p.id)} className="w-4 h-4 rounded border-gray-300 text-[#2275fc] focus:ring-[#2275fc]" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-page)] border" style={{ borderColor: "var(--border-color)" }} />
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{p.brand}</td>
                    <td className="px-5 py-4 font-bold" style={{ color: "var(--text-primary)" }}>FRw {Math.round(p.price).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        (p.quantity || 0) > 5 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                        (p.quantity || 0) > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                        "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400"
                      }`}>{p.quantity || 0}</span>
                    </td>
                    <td className="px-5 py-4"><span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#2275fc]/10 text-[#2275fc]">{p.category}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">{'★'.repeat(Math.round(p.rating || 0))}{'☆'.repeat(5 - Math.round(p.rating || 0))}</span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>({p.reviews || 0})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => navigate(`/products/detail?id=${p.id}`)} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#2275fc] hover:bg-[#2275fc]/10 transition">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-16 text-center" style={{ color: "var(--text-muted)" }}>No products found</td></tr>}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />}
        </div>
      )}
    </div>
  );
}
