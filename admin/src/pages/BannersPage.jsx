import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";

import { API } from "../config";

export default function BannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", badge: "", image: "", video: "", link: "#", position: "promo", active: 1, sort_order: 0 });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchBanners = () => {
    setLoading(true);
    fetch(`${API}/admin/banners`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setBanners(d); setLoading(false); });
  };
  useEffect(() => { fetchBanners(); }, []);

  const totalPages = Math.ceil(banners.length / perPage);
  const paginated = banners.slice((page - 1) * perPage, page * perPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = edit ? "PUT" : "POST";
    const url = edit ? `${API}/admin/banners/${edit}` : `${API}/admin/banners`;
    await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setEdit(null); setShowForm(false); setForm({ title: "", subtitle: "", description: "", badge: "", image: "", video: "", link: "#", position: "promo", active: 1, sort_order: 0 });
    fetchBanners();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`${API}/admin/banners/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchBanners();
  };

  const toggleActive = async (banner) => {
    await fetch(`${API}/admin/banners/${banner._id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ active: banner.active ? 0 : 1 }) });
    fetchBanners();
  };

  const openEdit = (b) => {
    setEdit(b._id);
    setForm({ title: b.title, subtitle: b.subtitle || "", description: b.description || "", badge: b.badge || "", image: b.image, video: b.video || "", link: b.link || "#", position: b.position, active: b.active, sort_order: b.sort_order });
    setShowForm(true);
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Banners</h1>
          <p className="text-sm text-[#575864] mt-1">{banners.length} banners</p>
        </div>
        <button onClick={() => { setEdit(null); setForm({ title: "", subtitle: "", description: "", image: "", video: "", link: "#", position: "promo", active: 1, sort_order: 0 }); setShowForm(true); }} className="h-[50px] px-5 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] border border-[#ECF0F4]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[#111]">{edit ? "Edit Banner" : "New Banner"}</h3>
            <button type="button" onClick={() => { setShowForm(false); setEdit(null); }} className="text-[#95989D] hover:text-[#575864]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitle" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description / Price" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Badge text (e.g. 20 Days Return)" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" required className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="Video URL (MP4, optional)" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link URL" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <input value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} type="number" placeholder="Sort order" className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] placeholder:text-[#858B93] bg-[#F2F7FB]" />
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="border border-[#ECF0F4] rounded-xl px-4 py-[14px] text-sm outline-none focus:border-[#2275fc] transition text-[#111] bg-[#F2F7FB]">
              <option value="hero">Hero Slider</option>
              <option value="side">Side Banner</option>
              <option value="promo">Promo (ThreeBanners)</option>
              <option value="banner">Banner (TwoBanners)</option>
              <option value="featured">Featured Section</option>
              <option value="featured-video">Featured Video Banner</option>
              <option value="latest">Latest Products Banner</option>
              <option value="section">Full-Width Section Banner</option>
              <option value="promo-grid">Promo Grid (2-Column Banners)</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#2275fc] text-white px-6 py-[14px] rounded-xl text-sm font-bold hover:bg-[#1a5fcf] transition-all">{edit ? "Update Banner" : "Create Banner"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEdit(null); }} className="border border-[#ECF0F4] text-[#575864] px-6 py-[14px] rounded-xl text-sm font-semibold hover:bg-[#F2F7FB] transition">Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div> : (
        <>
        <div className="space-y-[20px]">
          {paginated.map((b) => (
            <div key={b._id} className="bg-white rounded-[14px] border border-[#ECF0F4] shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] overflow-hidden hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-52 shrink-0 bg-[#F2F7FB]">
                  <img src={b.image} alt={b.title} className="w-full h-32 sm:h-full object-cover" />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-bold text-[#111]">{b.title}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.position === "hero" ? "bg-[#F5F3FF] text-[#8B5CF6]" : b.position === "featured" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#EEF5FF] text-[#2275fc]"}`}>{b.position}</span>
                      <button onClick={() => toggleActive(b)} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.active ? "bg-[#F0FDF4] text-[#22C55E]" : "bg-[#F2F7FB] text-[#95989D]"}`}>{b.active ? "Active" : "Inactive"}</button>
                    </div>
                    {b.subtitle && <p className="text-sm text-[#575864]">{b.subtitle}</p>}
                    {b.description && <p className="text-sm text-[#95989D] mt-1">{b.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => openEdit(b)} className="text-xs font-semibold text-[#2275fc] hover:bg-[#EEF5FF] px-3 py-1.5 rounded-lg transition">Edit</button>
                    <button onClick={() => handleDelete(b._id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Delete</button>
                    <span className="text-xs text-[#CBD5E1] ml-auto">Order: {b.sort_order}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <div className="text-center py-16 text-[#95989D]">No banners yet</div>}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
