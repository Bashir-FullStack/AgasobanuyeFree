import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

function SectionCard({ title, subtitle, children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="rounded-2xl p-6 lg:p-7 space-y-5 transition-all duration-700 ease-out"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--shadow)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div>
        <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h5>
        {subtitle && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AddProductPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCategories(data.map(c => c.name)))
      .catch(() => setCategories(["Fashion", "Electronics", "Furniture"]));
    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(data => setBrands(data.map(b => b.name)))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "", brand: "", category: "", price: "", oldPrice: "",
    badge: "", sale: "", saleStart: "", endDate: "", description: "", features: "",
    sizesInput: "", colorsInput: "", quantity: "", unit: "",
  });
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  const [bulkQty, setBulkQty] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const colorPresets = [
    { name: "White", hex: "#ffffff" }, { name: "Black", hex: "#000000" }, { name: "Gray", hex: "#6b7280" },
    { name: "Silver", hex: "#d1d5db" }, { name: "Beige", hex: "#f5f5dc" }, { name: "Cream", hex: "#fef3c7" },
    { name: "Brown", hex: "#92400e" }, { name: "Navy", hex: "#1e3a5f" }, { name: "Dark", hex: "#1e293b" },
    { name: "Red", hex: "#ef4444" }, { name: "Maroon", hex: "#7f1d1d" }, { name: "Orange", hex: "#f97316" },
    { name: "Coral", hex: "#f43f5e" }, { name: "Peach", hex: "#fed7aa" }, { name: "Yellow", hex: "#eab308" },
    { name: "Gold", hex: "#d97706" }, { name: "Green", hex: "#22c55e" }, { name: "Mint", hex: "#a7f3d0" },
    { name: "Teal", hex: "#14b8a6" }, { name: "Sky Blue", hex: "#38bdf8" }, { name: "Baby Blue", hex: "#93c5fd" },
    { name: "Blue", hex: "#3b82f6" }, { name: "Cyan", hex: "#06b6d4" }, { name: "Purple", hex: "#8b5cf6" },
    { name: "Lavender", hex: "#c4b5fd" }, { name: "Indigo", hex: "#6366f1" }, { name: "Pink", hex: "#ec4899" },
    { name: "Hot Pink", hex: "#db2777" }, { name: "Rose", hex: "#fb7185" }, { name: "Blush", hex: "#fbcfe8" },
    { name: "Lime", hex: "#65a30d" }, { name: "Amber", hex: "#d97706" }, { name: "Turquoise", hex: "#2dd4bf" },
    { name: "Mauve", hex: "#d8b4fe" }, { name: "Burgundy", hex: "#6b021a" },
  ];
  const [customColor, setCustomColor] = useState("#3b82f6");
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const removeImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const sizes = form.sizesInput.split(",").map(s => s.trim()).filter(Boolean);
    const colors = form.colorsInput.split(",").map(c => c.trim()).filter(Boolean);
    const urlImages = images.filter(img => img.url && !img.file).map(img => img.url);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("price", Number(form.price));
    if (form.oldPrice) formData.append("oldPrice", Number(form.oldPrice));
    if (form.badge) formData.append("badge", form.badge);
    if (form.sale) formData.append("sale", form.sale);
    if (form.saleStart) formData.append("saleStart", form.saleStart);
    if (form.description) formData.append("description", form.description);
    if (form.endDate) formData.append("endDate", form.endDate);
    if (form.quantity) formData.append("quantity", Number(form.quantity));
    if (form.unit) formData.append("unit", form.unit);
    if (bulkDiscounts.length > 0) formData.append("bulkDiscount", JSON.stringify(bulkDiscounts));
    if (sizes.length > 0) formData.append("sizes", JSON.stringify(sizes));
    if (colors.length > 0) formData.append("colors", JSON.stringify(colors));
    if (urlImages.length > 0) formData.append("imageUrls", JSON.stringify(urlImages));

    const mainImage = images.find(img => img.file);
    if (mainImage) formData.append("image", mainImage.file);
    else if (urlImages.length > 0) formData.append("image", urlImages[0]);

    const otherImages = images.filter(img => img.file && img !== mainImage);
    otherImages.forEach((img) => formData.append("images", img.file));

    try {
      const res = await fetch(`${API}/admin/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) navigate("/products");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Add Product</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Create a new product for your store</p>
        </div>
        <button onClick={() => navigate("/products")} className="h-[42px] px-4 text-sm font-semibold rounded-xl border transition-all flex items-center gap-2" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <SectionCard title="Basic Information" subtitle="Enter the core details about your product" delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Product Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={update("name")} required placeholder="Enter product name" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Brand <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <select value={form.brand} onChange={update("brand")} required className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20 appearance-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="">Select brand</option>
                  {brands.map((b) => <option key={b}>{b}</option>)}
                </select>
                <input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="New" className="w-24 px-3 py-3 text-sm rounded-xl outline-none transition-all" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                <button type="button" onClick={() => { if (newBrand.trim()) { setBrands(prev => [...prev, newBrand.trim()]); setForm(prev => ({ ...prev, brand: newBrand.trim() })); setNewBrand(""); } }} className="px-3 rounded-xl bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-xs font-semibold hover:shadow-md transition-all">Add</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={update("category")} required className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20 appearance-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Badge</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: "New", bg: "emerald" }, { label: "Hot", bg: "orange" },
                  { label: "Sale", bg: "blue" }, { label: "Best", bg: "purple" },
                  { label: "Trending", bg: "pink" }, { label: "Popular", bg: "teal" },
                ].map((b) => (
                  <button key={b.label} type="button" onClick={() => setForm({ ...form, badge: form.badge === b.label ? "" : b.label })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      form.badge === b.label
                        ? "text-white shadow-md scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: form.badge === b.label ? `var(--${b.bg === "emerald" ? "c" + "22C55E" : b.bg})` : "var(--bg-input)",
                      color: form.badge === b.label ? "white" : "var(--text-secondary)",
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={update("description")} required rows={4} placeholder="Write a detailed product description..." className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20 resize-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Features / Key Highlights</label>
            <textarea value={form.features} onChange={update("features")} rows={3} placeholder="Enter key features separated by commas (e.g. 100% Cotton, Machine Washable, Available in 5 colors)" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20 resize-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Pricing" subtitle="Set the price and inventory details" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Price <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>FRw</span>
                <input value={form.price} onChange={update("price")} required type="number" step="0.01" min="0" placeholder="0" className="w-full pl-14 pr-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Old Price (for sale)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--text-muted)" }}>FRw</span>
                <input value={form.oldPrice} onChange={update("oldPrice")} type="number" step="0.01" min="0" placeholder="0" className="w-full pl-14 pr-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Stock Quantity <span className="text-red-500">*</span></label>
              <input value={form.quantity} onChange={update("quantity")} type="number" min="0" placeholder="0" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Selling Unit</label>
              <select value={form.unit} onChange={update("unit")} className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20 appearance-none" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <option value="">Select unit</option>
                <option value="piece">Per Piece</option>
                <option value="box">Per Box</option>
                <option value="weight">Per Weight (kg)</option>
                <option value="liter">Per Liter</option>
                <option value="meter">Per Meter</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Flash Sale */}
        <SectionCard title="Flash Sale" subtitle="Set up a promotional sale period" delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Sale Label</label>
              <input value={form.sale} onChange={update("sale")} placeholder="e.g. -20%, 50% OFF" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Start Date</label>
              <input value={form.saleStart} onChange={update("saleStart")} type="date" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>End Date</label>
              <input value={form.endDate} onChange={update("endDate")} type="date" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
          </div>
        </SectionCard>

        {/* Bulk Discount */}
        <SectionCard title="Bulk Discount" subtitle="Quantity-based pricing tiers (optional)" delay={300}>
          {bulkDiscounts.length > 0 && (
            <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: "var(--bg-page)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <th className="p-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Min Qty</th>
                    <th className="p-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Unit Price</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {bulkDiscounts.map((d, i) => (
                    <tr key={i} className="transition-all" style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td className="p-3 font-medium" style={{ color: "var(--text-primary)" }}>{d.qty}+</td>
                      <td className="p-3" style={{ color: "var(--text-primary)" }}>FRw {Number(d.price).toLocaleString()}</td>
                      <td className="p-3"><button type="button" onClick={() => setBulkDiscounts(prev => prev.filter((_, j) => j !== i))} className="text-xs font-semibold text-red-500 hover:underline">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Min Quantity</label>
              <input value={bulkQty} onChange={e => setBulkQty(e.target.value)} type="number" min="2" placeholder="e.g. 5" className="w-28 px-3 py-[10px] text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Unit Price (FRw)</label>
              <input value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} type="number" min="0" placeholder="0" className="w-28 px-3 py-[10px] text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <button type="button" onClick={() => { if (bulkQty && bulkPrice) { setBulkDiscounts(prev => [...prev, { qty: Number(bulkQty), price: Number(bulkPrice) }].sort((a, b) => a.qty - b.qty)); setBulkQty(""); setBulkPrice(""); } }} className="h-[42px] px-4 rounded-xl bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-semibold hover:shadow-md transition-all">Add Tier</button>
          </div>
        </SectionCard>

        {/* Variants */}
        <SectionCard title="Variants" subtitle="Add sizes and colors (leave empty for weight-based items)" delay={400}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Sizes</label>
              <input value={form.sizesInput} onChange={update("sizesInput")} placeholder="e.g. S, M, L, XL (comma separated)" className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              {form.sizesInput && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {form.sizesInput.split(",").map((s, i) => s.trim() && (
                    <span key={i} className="px-3 py-1 text-xs font-semibold rounded-lg transition-all hover:scale-105" style={{ backgroundColor: "rgba(35,119,252,0.1)", color: "#2275fc" }}>{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Colors <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(click to add/remove)</span></label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {colorPresets.map(({ name, hex }) => {
                  const selected = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean).includes(hex);
                  return (
                    <button key={hex} type="button" onClick={() => {
                      const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean);
                      if (selected) setForm(prev => ({ ...prev, colorsInput: arr.filter(x => x !== hex).join(", ") }));
                      else setForm(prev => ({ ...prev, colorsInput: [...arr, hex].join(", ") }));
                    }} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border-2 text-[10px] font-semibold transition-all duration-200 ${selected ? "border-[#2275fc] shadow-sm scale-105" : ""}`} style={{ borderColor: selected ? "#2275fc" : "var(--border-color)", backgroundColor: selected ? "rgba(35,119,252,0.05)" : "var(--bg-card)" }}>
                      <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: hex, borderColor: hex === "#ffffff" ? "var(--border-color)" : hex }} />
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <input type="color" value={customColor || "#3b82f6"} onChange={e => setCustomColor(e.target.value)} className="w-[42px] h-[42px] rounded-xl border cursor-pointer p-1" style={{ borderColor: "var(--border-color)" }} />
                </div>
                <input value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="Or paste hex code" className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                <button type="button" onClick={() => { const hex = customColor.trim(); if (!hex) return; const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean); if (!arr.includes(hex)) setForm(prev => ({ ...prev, colorsInput: [...arr, hex].join(", ") })); setCustomColor(""); }} className="h-[42px] px-3 rounded-xl bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-semibold hover:shadow-md transition-all">Add</button>
              </div>
              {form.colorsInput && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.colorsInput.split(",").map((c, i) => c.trim() && (
                    <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:scale-105" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-page)" }}>
                      <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.trim(), borderColor: c.trim() === "#ffffff" ? "var(--border-color)" : c.trim() }} />
                      {c.trim()}
                      <button type="button" onClick={() => { const arr = form.colorsInput.split(",").map(x => x.trim()).filter(Boolean); arr.splice(i, 1); setForm(prev => ({ ...prev, colorsInput: arr.join(", ") })); }} className="text-red-400 hover:text-red-600 ml-0.5 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Images */}
        <SectionCard title="Product Images" subtitle="Upload product photos or add from URL" delay={500}>
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border transition-all duration-500 ease-out hover:shadow-lg card-hover"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-page)",
                    animation: `fadeScaleIn 0.3s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <img src={img.preview} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <button type="button" onClick={() => removeImage(img.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] px-2.5 py-2 truncate opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {img.name}
                  </div>
                  {i === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-[9px] font-bold shadow-md">Main</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-5 transition-all duration-300" style={{ backgroundColor: "var(--bg-page)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Upload from device</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-[130px] flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: "rgba(35,119,252,0.1)", color: "#2275fc" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Click to upload</span>
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>PNG, JPG, WEBP up to 5MB</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </div>

            <div className="rounded-xl p-5 transition-all duration-300" style={{ backgroundColor: "var(--bg-page)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Or add from URL</p>
              <div className="flex gap-2">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 px-4 py-[11px] text-sm rounded-xl outline-none transition-all focus:ring-2 focus:ring-[#2275fc]/20" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                <button type="button" onClick={addImageUrl} disabled={!imageUrl.trim()} className="h-[42px] px-4 rounded-xl bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add
                </button>
              </div>
            </div>
          </div>

          {images.length === 0 && (
            <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>No images yet. Upload from device or add via URL.</p>
          )}
        </SectionCard>

        {/* Publish */}
        <div
          className="rounded-2xl p-6 lg:p-7 space-y-4 transition-all duration-700 ease-out"
          style={{
            backgroundColor: "var(--bg-card)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Publish</h5>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Review all product details before publishing. You can edit anytime.</p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {images.length} image{images.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button type="submit" disabled={submitting} className="w-full h-[52px] bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
            {submitting ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Publishing...</>
            ) : (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Publish Product</>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
