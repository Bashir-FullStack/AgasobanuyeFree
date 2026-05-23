import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function NewCategoryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setImage({ file: f, preview: URL.createObjectURL(f) });
  };

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description || "");
    if (image?.file) {
      formData.append("image", image.file);
    } else if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }

    try {
      const res = await fetch(`${API}/admin/categories`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) navigate("/categories");
      else {
        const data = await res.json();
        setError(data.error || "Failed to create category");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>New Category</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Create a new product category</p>
        </div>
        <button onClick={() => navigate("/categories")} className="h-[44px] px-5 border text-sm font-semibold rounded-xl hover:bg-[var(--bg-input)] transition-all flex items-center gap-2" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        <div className="xl:col-span-2 space-y-[30px]">
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Category Info</h5>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Category Name <span className="text-[#FF5200]">*</span></label>
              <input value={form.name} onChange={update("name")} required placeholder="Enter category name" className="w-full px-[22px] py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Description</label>
              <textarea value={form.description} onChange={update("description")} rows={4} placeholder="Brief description of this category..." className="w-full px-[22px] py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)] resize-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Image URL</label>
              <input value={form.imageUrl} onChange={update("imageUrl")} placeholder="https://example.com/category-image.jpg" className="w-full px-[22px] py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
        </div>

        <div className="space-y-[30px]">
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            {error && <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg p-3">{error}</p>}
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Category Image</h5>
            {image ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border group" style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border-color)" }}>
                <img src={image.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImage(null)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl transition cursor-pointer" style={{ borderColor: "var(--text-muted)", color: "var(--text-secondary)", backgroundColor: "var(--bg-page)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-sm font-medium">Upload from Device</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Publish</h5>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Review and save the new category.</p>
            <button type="submit" disabled={submitting} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] border border-[#2275fc] transition-all disabled:opacity-50">{submitting ? "Saving..." : "Save Category"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
