import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

import { API } from "../config";

export default function BrandsPage() {
  const { token } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;
  const fileRef = useRef(null);

  const fetchBrands = () => {
    setLoading(true);
    fetch(`${API}/admin/brands`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setBrands(d); setLoading(false); });
  };
  useEffect(() => { fetchBrands(); }, []);

  const totalPages = Math.ceil(brands.length / perPage);
  const paginated = brands.slice((page - 1) * perPage, page * perPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/admin/brands/${editId}` : `${API}/admin/brands`;

    const formData = new FormData();
    formData.append("name", name.trim());
    if (description.trim()) formData.append("description", description.trim());
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setName(""); setDescription(""); setImageUrl(""); setImageFile(null); setEditId(null); setShowForm(false); fetchBrands();
  };

  const handleDelete = async (id) => {
    if (!id) { alert("Invalid brand ID"); return; }
    if (!confirm("Delete this brand?")) return;
    await fetch(`${API}/admin/brands/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchBrands();
  };

  const openEdit = (b) => {
    setEditId(b._id);
    setName(b.name);
    setDescription(b.description || "");
    setImageUrl(b.image || "");
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setImageFile(f); setImageUrl(URL.createObjectURL(f)); }
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Brands</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{brands.length} brands</p>
        </div>
        <button onClick={() => { setEditId(null); setName(""); setDescription(""); setImageUrl(""); setImageFile(null); setShowForm(true); }} className="h-[50px] px-5 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Brand
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{editId ? "Edit Brand" : "New Brand"}</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setName(""); setDescription(""); setImageUrl(""); setImageFile(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand name..." required className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-[14px] text-sm font-semibold rounded-xl border transition flex items-center gap-2" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)", backgroundColor: "var(--bg-input)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Logo
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {imageFile && <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Selected</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#2275fc] text-white px-6 py-[14px] rounded-xl text-sm font-bold hover:bg-[#1a5fcf] transition-all">{editId ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setName(""); setDescription(""); setImageUrl(""); setImageFile(null); }} className="border px-6 py-[14px] rounded-xl text-sm font-semibold hover:bg-[var(--bg-input)] transition" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div> : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {paginated.map((b) => (
            <div key={b._id} className="rounded-[14px] border p-5 hover:shadow-md transition-all" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "var(--shadow)" }}>
              {b.image ? (
                <img src={b.image} alt={b.name} className="w-full h-32 rounded-xl object-contain mb-3 p-4" style={{ backgroundColor: "var(--bg-page)" }} />
              ) : (
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold mb-3">
                  {b.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{b.name}</h4>
              {b.description && <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{b.description}</p>}
              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => openEdit(b)} className="text-xs font-semibold text-[#2275fc] hover:bg-[#EEF5FF] px-3 py-1.5 rounded-lg transition">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Delete</button>
              </div>
            </div>
          ))}
          {brands.length === 0 && <div className="col-span-full text-center py-16" style={{ color: "var(--text-muted)" }}>No brands yet</div>}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
