import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function AddBannerPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const urlRef = useRef(null);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", link: "#", position: "hero", active: 1, bg_color: "", sort_order: 0 });
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((f) => ({ id: Math.random().toString(36).slice(2), file: f, preview: URL.createObjectURL(f), name: f.name }));
    setImages((prev) => [...prev, ...newImgs]);
    e.target.value = "";
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { id: Math.random().toString(36).slice(2), url: imageUrl.trim(), preview: imageUrl.trim(), name: "URL" }]);
    setImageUrl("");
  };

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fileImage = images.find(img => img.file);
    const payload = { title: form.title, subtitle: form.subtitle, description: form.description, link: form.link || "#", position: form.position, active: form.active, bg_color: form.bg_color, sort_order: Number(form.sort_order) };
    try {
      let res;
      if (fileImage) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== "") fd.append(k, v); });
        fd.append("image", fileImage.file);
        res = await fetch(`${API}/admin/banners`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      } else {
        payload.image = images.length > 0 ? images[0].url : "";
        res = await fetch(`${API}/admin/banners`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      }
      if (res.ok) navigate("/banners");
      else { const d = await res.json(); alert(d.error || "Failed to save banner"); }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Add Banner</h1>
          <p className="text-sm text-[#575864] mt-1">Create a new banner for your storefront</p>
        </div>
        <button onClick={() => navigate("/banners")} className="h-[44px] px-5 bg-white border border-[#ECF0F4] text-[#575864] text-sm font-semibold rounded-xl hover:bg-[#F2F7FB] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Banners
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        <div className="xl:col-span-2 space-y-[30px]">
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Banner Details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Title <span className="text-[#FF5200]">*</span></label>
                <input value={form.title} onChange={update("title")} required placeholder="Banner headline" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Subtitle</label>
                <input value={form.subtitle} onChange={update("subtitle")} placeholder="Supporting text" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Description / Price</label>
              <input value={form.description} onChange={update("description")} placeholder="e.g. Starting at $19.99" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Link URL</label>
              <input value={form.link} onChange={update("link")} placeholder="https://example.com/shop/..." className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Settings</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Position</label>
                <select value={form.position} onChange={update("position")} className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition appearance-none">
                  <option value="hero">Hero Slider</option>
                  <option value="side">Side Banner</option>
                  <option value="promo">Promo Banner</option>
                  <option value="banner">Banner (TwoBanners)</option>
                  <option value="featured">Featured Section</option>
                  <option value="featured-video">Featured Video Banner</option>
                  <option value="latest">Latest Products Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Status</label>
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="active" checked={form.active === 1} onChange={() => setForm((p) => ({ ...p, active: 1 }))} className="w-4 h-4 text-[#2275fc]" />
                    <span className="text-sm text-[#575864]">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="active" checked={form.active === 0} onChange={() => setForm((p) => ({ ...p, active: 0 }))} className="w-4 h-4 text-[#2275fc]" />
                    <span className="text-sm text-[#575864]">Inactive</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Background Color</label>
                <input value={form.bg_color} onChange={update("bg_color")} placeholder="e.g. #1e293b" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Sort Order</label>
                <input value={form.sort_order} onChange={update("sort_order")} type="number" placeholder="0" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-[30px]">
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Banner Images</h5>
            {images.length > 0 && (
              <div className="space-y-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden bg-[#F2F7FB] border border-[#ECF0F4] aspect-video">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-[120px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#CBD5E1] rounded-xl text-[#575864] hover:border-[#2275fc] hover:text-[#2275fc] transition cursor-pointer bg-[#F8FAFC]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="text-sm font-medium">Upload from device</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            <div className="flex gap-2">
              <input ref={urlRef} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/banner.jpg" className="flex-1 px-[16px] py-[10px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              <button type="button" onClick={addImageUrl} disabled={!imageUrl.trim()} className="h-[42px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition disabled:opacity-50">Add URL</button>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-4">
            <h5 className="text-lg font-bold text-[#111]">Publish</h5>
            <p className="text-xs text-[#575864]">The banner will appear on the storefront immediately after publishing.</p>
            <button type="submit" disabled={submitting} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] border border-[#2275fc] transition-all disabled:opacity-50">{submitting ? "Saving..." : "Save Banner"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
