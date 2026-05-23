import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

export default function ProductDetailPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  const [bulkQty, setBulkQty] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [customColor, setCustomColor] = useState("#3b82f6");
  const colorPresets = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Gray", hex: "#6b7280" },
    { name: "Silver", hex: "#d1d5db" },
    { name: "Beige", hex: "#f5f5dc" },
    { name: "Cream", hex: "#fef3c7" },
    { name: "Brown", hex: "#92400e" },
    { name: "Navy", hex: "#1e3a5f" },
    { name: "Dark", hex: "#1e293b" },
    { name: "Red", hex: "#ef4444" },
    { name: "Maroon", hex: "#7f1d1d" },
    { name: "Orange", hex: "#f97316" },
    { name: "Coral", hex: "#f43f5e" },
    { name: "Peach", hex: "#fed7aa" },
    { name: "Yellow", hex: "#eab308" },
    { name: "Gold", hex: "#d97706" },
    { name: "Green", hex: "#22c55e" },
    { name: "Mint", hex: "#a7f3d0" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Sky Blue", hex: "#38bdf8" },
    { name: "Baby Blue", hex: "#93c5fd" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Cyan", hex: "#06b6d4" },
    { name: "Purple", hex: "#8b5cf6" },
    { name: "Lavender", hex: "#c4b5fd" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Hot Pink", hex: "#db2777" },
    { name: "Rose", hex: "#fb7185" },
    { name: "Blush", hex: "#fbcfe8" },
    { name: "Lime", hex: "#65a30d" },
    { name: "Amber", hex: "#d97706" },
    { name: "Turquoise", hex: "#2dd4bf" },
    { name: "Mauve", hex: "#d8b4fe" },
    { name: "Burgundy", hex: "#6b021a" },
  ];

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCategories(data.map(c => c.name)))
      .catch(() => setCategories(["Fashion", "Electronics", "Furniture"]));
    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(data => setBrands(data.map(b => b.name)))
      .catch(() => {});
    if (!productId) return;
    fetch(`${API}/products/${productId}`)
      .then(r => r.json())
      .then(d => {
        setForm({
          name: d.name || "",
          brand: d.brand || "",
          category: d.category || "Fashion",
          price: String(d.price || ""),
          oldPrice: d.oldPrice ? String(d.oldPrice) : "",
          badge: d.badge || "",
          sale: d.sale || "",
          saleStart: d.saleStart || "",
          endDate: d.endDate || "",
          description: d.description || "",
          quantity: d.quantity || 0,
          unit: d.unit || "",
          sizesInput: (d.sizes || []).join(", "),
          colorsInput: (d.colors || []).join(", "),
        });
        setBulkDiscounts(d.bulkDiscount || []);
        setImages((d.images || []).map((url, i) => ({ id: `existing-${i}`, url, preview: url, name: `Image ${i + 1}` })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  const [images, setImages] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { id: Math.random().toString(36).slice(2), url: imageUrl.trim(), preview: imageUrl.trim(), name: "URL Image" }]);
    setImageUrl("");
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const sizes = form.sizesInput.split(",").map(s => s.trim()).filter(Boolean);
    const colors = form.colorsInput.split(",").map(c => c.trim()).filter(Boolean);
    const imageUrls = images.map((img) => img.url || img.preview);

    try {
      const res = await fetch(`${API}/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name, brand: form.brand, category: form.category,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
          badge: form.badge, sale: form.sale, saleStart: form.saleStart || null,
          endDate: form.endDate || null, description: form.description,
          quantity: Number(form.quantity) || 0, unit: form.unit || "",
          bulkDiscount: bulkDiscounts, sizes, colors, images: imageUrls, image: imageUrls[0] || "",
        }),
      });
      if (res.ok) {
        alert("Product updated!");
        navigate("/products");
        return;
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update product");
      }
    } catch (err) {
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div>;
  if (!form) return <div className="text-center py-16"><p className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>Product not found</p></div>;

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{form.name || "Edit Product"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Edit product information</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/products")} className="h-[44px] px-5 border text-sm font-semibold rounded-xl hover:bg-[var(--bg-page)] transition-all flex items-center gap-2" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button onClick={handleSave} disabled={saving} className="h-[44px] px-6 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all flex items-center gap-2 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        <div className="xl:col-span-2 space-y-[30px]">
          {/* Images */}
          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Product Images</h5>
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F2F7FB] border border-[#ECF0F4]">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-[100px] flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#CBD5E1] rounded-xl text-[#575864] hover:border-[#2275fc] hover:text-[#2275fc] transition cursor-pointer bg-[#F8FAFC]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-sm font-medium">Upload images</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </div>
            <div className="flex gap-2">
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or add image URL..." className="flex-1 px-[16px] py-[10px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" style={{ color: "var(--text-primary)" }} />
              <button type="button" onClick={addImageUrl} disabled={!imageUrl.trim()} className="h-[42px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition disabled:opacity-50">Add</button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Basic Information</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Name</label>
                <input value={form.name} onChange={update("name")} className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Brand</label>
                <div className="flex gap-2">
                  <select value={form.brand} onChange={update("brand")} className="flex-1 px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition appearance-none" style={{ color: "var(--text-primary)" }}>
                    <option value="">Select brand</option>
                    {brands.map((b) => <option key={b}>{b}</option>)}
                  </select>
                  <input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="New" className="w-24 px-[14px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                  <button type="button" onClick={() => { if (newBrand.trim()) { setBrands(prev => [...prev, newBrand.trim()]); setForm(prev => ({ ...prev, brand: newBrand.trim() })); setNewBrand(""); } }} className="px-3 bg-[#2275fc] text-white text-xs font-semibold rounded-xl hover:bg-[#1a5fcf] transition">Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Category</label>
                <select value={form.category} onChange={update("category")} className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Badge</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "New", bg: "bg-green-500" },
                    { label: "Hot", bg: "bg-orange-500" },
                    { label: "Sale", bg: "bg-blue-500" },
                    { label: "Best", bg: "bg-purple-500" },
                    { label: "Trending", bg: "bg-pink-500" },
                    { label: "Popular", bg: "bg-teal-500" },
                  ].map((b) => (
                    <button key={b.label} type="button" onClick={() => setForm({ ...form, badge: form.badge === b.label ? "" : b.label })} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${form.badge === b.label ? `${b.bg} text-white shadow-md scale-105` : "bg-[#ECF0F4] text-[#575864] hover:bg-[#DEE4EA]"}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Description</label>
                <textarea value={form.description} onChange={update("description")} rows={4} className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition resize-none" style={{ color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Pricing</h5>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Price</label>
                <input value={form.price} onChange={update("price")} type="number" step="0.01" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Old Price</label>
                <input value={form.oldPrice} onChange={update("oldPrice")} type="number" step="0.01" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Stock Quantity</label>
                <input value={form.quantity} onChange={update("quantity")} type="number" min="0" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Selling Unit</label>
                <select value={form.unit} onChange={update("unit")} className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }}>
                  <option value="">Select</option>
                  <option value="piece">Per Piece</option>
                  <option value="box">Per Box</option>
                  <option value="weight">Per Weight (kg)</option>
                  <option value="liter">Per Liter</option>
                  <option value="meter">Per Meter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Flash Sale */}
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Flash Sale</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sale Label</label>
                <input value={form.sale} onChange={update("sale")} placeholder="e.g. -20%" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sale Start</label>
                <input value={form.saleStart} onChange={update("saleStart")} type="date" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sale End</label>
                <input value={form.endDate} onChange={update("endDate")} type="date" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>

          {/* Bulk Discount */}
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Bulk / Volume Discount</h5>
            {bulkDiscounts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><thead><tr className="text-left border-b" style={{ borderColor: "var(--border-color)" }}><th className="pb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Min Qty</th><th className="pb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Unit Price (FRw)</th><th className="pb-2"></th></tr></thead><tbody>{bulkDiscounts.map((d, i) => (
                  <tr key={i}><td className="py-2" style={{ color: "var(--text-primary)" }}>{d.qty}+</td><td className="py-2 font-semibold" style={{ color: "var(--text-primary)" }}>FRw {Number(d.price).toLocaleString()}</td><td className="py-2"><button type="button" onClick={() => setBulkDiscounts(prev => prev.filter((_, j) => j !== i))} className="text-red-500 text-xs hover:underline">Remove</button></td></tr>
                ))}</tbody></table>
              </div>
            )}
            <div className="flex items-end gap-3">
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Min Qty</label><input value={bulkQty} onChange={e => setBulkQty(e.target.value)} type="number" min="2" placeholder="5" className="w-24 px-3 py-[10px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} /></div>
              <div><label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Unit Price (FRw)</label><input value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} type="number" min="0" placeholder="0" className="w-24 px-3 py-[10px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} /></div>
              <button type="button" onClick={() => { if (bulkQty && bulkPrice) { setBulkDiscounts(prev => [...prev, { qty: Number(bulkQty), price: Number(bulkPrice) }].sort((a, b) => a.qty - b.qty)); setBulkQty(""); setBulkPrice(""); } }} className="h-[42px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition">Add</button>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Variants <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(optional — leave empty for food/weight items)</span></h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Sizes</label>
                <input value={form.sizesInput} onChange={update("sizesInput")} placeholder="S, M, L, XL, XXL (comma separated)" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" style={{ color: "var(--text-primary)" }} />
                {form.sizesInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.sizesInput.split(",").map((s, i) => s.trim() && <span key={i} className="px-2.5 py-1 bg-[#EEF5FF] text-[#2275fc] text-xs font-semibold rounded-lg">{s.trim()}</span>)}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Colors <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(click to add/remove)</span></label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colorPresets.map(({ name, hex }) => {
                    const selected = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean).includes(hex);
                    return (
                      <button key={hex} type="button" onClick={() => {
                        const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean);
                        if (selected) setForm(prev => ({ ...prev, colorsInput: arr.filter(x => x !== hex).join(", ") }));
                        else setForm(prev => ({ ...prev, colorsInput: [...arr, hex].join(", ") }));
                      }} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-xs font-semibold transition ${selected ? "border-[#2275fc] bg-[#EEF5FF] shadow-sm" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                        <span className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: hex }} />
                        {name}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input type="color" value={customColor || "#3b82f6"} onChange={e => setCustomColor(e.target.value)} className="w-[46px] h-[46px] rounded-xl border border-[#ECF0F4] cursor-pointer p-1 bg-white" />
                  </div>
                  <input value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="Or paste hex code e.g. #ff5733" className="flex-1 px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" style={{ color: "var(--text-primary)" }} />
                  <button type="button" onClick={() => {
                    const hex = customColor.trim();
                    if (!hex) return;
                    const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean);
                    if (!arr.includes(hex)) setForm(prev => ({ ...prev, colorsInput: [...arr, hex].join(", ") }));
                    setCustomColor("");
                  }} className="h-[46px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition">Add</button>
                </div>
                {form.colorsInput && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.colorsInput.split(",").map((c, i) => c.trim() && (
                      <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-xs font-semibold rounded-lg border border-gray-200">
                        <span className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: c.trim() }} />
                        {c.trim()}
                        <button type="button" onClick={() => { const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean); arr.splice(i, 1); setForm(prev => ({ ...prev, colorsInput: arr.join(", ") })); }} className="text-red-400 hover:text-red-600 ml-0.5 font-bold text-sm">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-[30px]">
          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Summary</h5>
            {images[0] && <img src={images[0].preview} alt="" className="w-full aspect-video object-cover rounded-xl" />}
            <div className="flex items-center gap-1 text-yellow-500 text-sm">{"★".repeat(4)}{"☆".repeat(1)}</div>
            <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>FRw {Number(form.price || 0).toLocaleString()}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Category</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.category}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-secondary)" }}>Sizes</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.sizesInput || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: "var(--text-secondary)" }}>Colors</span>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.colorsInput || "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <button onClick={handleSave} disabled={saving} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
