import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { API } from "../config";

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

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

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
    if (mainImage) {
      formData.append("image", mainImage.file);
    } else if (urlImages.length > 0) {
      formData.append("image", urlImages[0]);
    }

    const otherImages = images.filter(img => img.file && img !== mainImage);
    otherImages.forEach((img) => {
      formData.append("images", img.file);
    });

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
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Add Product</h1>
          <p className="text-sm text-[#575864] mt-1">Create a new product for your store</p>
        </div>
        <button onClick={() => navigate("/products")} className="h-[44px] px-5 bg-white border border-[#ECF0F4] text-[#575864] text-sm font-semibold rounded-xl hover:bg-[#F2F7FB] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        {/* Left - Main Info */}
        <div className="xl:col-span-2 space-y-[30px]">
          {/* Basic Info */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Basic Information</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Product Name <span className="text-[#FF5200]">*</span></label>
                <input value={form.name} onChange={update("name")} required placeholder="Enter product name" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Brand <span className="text-[#FF5200]">*</span></label>
                <div className="flex gap-2">
                  <select value={form.brand} onChange={update("brand")} required className="flex-1 px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition appearance-none">
                    <option value="">Select brand</option>
                    {brands.map((b) => <option key={b}>{b}</option>)}
                  </select>
                  <input value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Or type new" className="w-36 px-[14px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                  <button type="button" onClick={() => { if (newBrand.trim()) { setBrands(prev => [...prev, newBrand.trim()]); setForm(prev => ({ ...prev, brand: newBrand.trim() })); setNewBrand(""); } }} className="px-3 bg-[#2275fc] text-white text-xs font-semibold rounded-xl hover:bg-[#1a5fcf] transition">Add</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Category <span className="text-[#FF5200]">*</span></label>
                <select value={form.category} onChange={update("category")} required className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition appearance-none">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Badge</label>
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
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Description <span className="text-[#FF5200]">*</span></label>
              <textarea value={form.description} onChange={update("description")} required rows={5} placeholder="Write a detailed product description..." className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93] resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Features / Key Highlights</label>
              <textarea value={form.features} onChange={update("features")} rows={3} placeholder="Enter key features separated by commas (e.g. 100% Cotton, Machine Washable, Available in 5 colors)" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93] resize-none" />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Pricing</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Price <span className="text-[#FF5200]">*</span></label>
                <div className="relative">
                  <span className="absolute left-[22px] top-1/2 -translate-y-1/2 text-[#575864] text-sm font-semibold">$</span>
                  <input value={form.price} onChange={update("price")} required type="number" step="0.01" min="0" placeholder="0.00" className="w-full pl-9 pr-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Old Price (for sale)</label>
                <div className="relative">
                  <span className="absolute left-[22px] top-1/2 -translate-y-1/2 text-[#575864] text-sm font-semibold">$</span>
                  <input value={form.oldPrice} onChange={update("oldPrice")} type="number" step="0.01" min="0" placeholder="0.00" className="w-full pl-9 pr-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Stock Quantity <span className="text-[#FF5200]">*</span></label>
                <input value={form.quantity} onChange={update("quantity")} type="number" min="0" placeholder="0" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Selling Unit</label>
                <select value={form.unit} onChange={update("unit")} className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition appearance-none">
                  <option value="">Select unit</option>
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
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Flash Sale</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Sale Label</label>
                <input value={form.sale} onChange={update("sale")} placeholder="e.g. -20%, 50% OFF" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Sale Start Date</label>
                <input value={form.saleStart} onChange={update("saleStart")} type="date" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Sale End Date</label>
                <input value={form.endDate} onChange={update("endDate")} type="date" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition" />
              </div>
            </div>
          </div>

          {/* Bulk Discount */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Bulk / Volume Discount <span className="text-xs font-normal text-[#95989D]">(optional — quantity-based pricing)</span></h5>
            {bulkDiscounts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left border-b border-gray-100"><th className="pb-2 font-semibold text-[#575864]">Min Qty</th><th className="pb-2 font-semibold text-[#575864]">Unit Price (FRw)</th><th className="pb-2"></th></tr></thead>
                  <tbody>{bulkDiscounts.map((d, i) => (
                    <tr key={i}>
                      <td className="py-2 text-[#111] font-medium">{d.qty}+</td>
                      <td className="py-2 text-[#111]">FRw {Number(d.price).toLocaleString()}</td>
                      <td className="py-2"><button type="button" onClick={() => setBulkDiscounts(prev => prev.filter((_, j) => j !== i))} className="text-red-500 text-xs hover:underline">Remove</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            <div className="flex items-end gap-3">
              <div><label className="block text-xs font-semibold text-[#575864] mb-1">Min Quantity</label><input value={bulkQty} onChange={e => setBulkQty(e.target.value)} type="number" min="2" placeholder="e.g. 5" className="w-28 px-3 py-[10px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" /></div>
              <div><label className="block text-xs font-semibold text-[#575864] mb-1">Unit Price (FRw)</label><input value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} type="number" min="0" placeholder="0" className="w-28 px-3 py-[10px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" /></div>
              <button type="button" onClick={() => { if (bulkQty && bulkPrice) { setBulkDiscounts(prev => [...prev, { qty: Number(bulkQty), price: Number(bulkPrice) }].sort((a, b) => a.qty - b.qty)); setBulkQty(""); setBulkPrice(""); } }} className="h-[42px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition">Add Tier</button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Variants <span className="text-xs font-normal text-[#95989D]">(optional — leave empty for food/weight-based items)</span></h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Sizes</label>
                <input value={form.sizesInput} onChange={update("sizesInput")} placeholder="e.g. S, M, L, XL, XXL (comma separated)" className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                {form.sizesInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.sizesInput.split(",").map((s, i) => s.trim() && <span key={i} className="px-2.5 py-1 bg-[#EEF5FF] text-[#2275fc] text-xs font-semibold rounded-lg">{s.trim()}</span>)}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-[#111] mb-2.5">Colors <span className="text-xs font-normal text-[#95989D]">(click to add/remove)</span></label>
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
                  <input value={customColor} onChange={e => setCustomColor(e.target.value)} placeholder="Or paste hex code e.g. #ff5733" className="flex-1 px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
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

        {/* Right - Images */}
        <div className="space-y-[30px]">
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-5">
            <h5 className="text-lg font-bold text-[#111]">Product Images</h5>

            {/* Image preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[#F2F7FB] border border-[#ECF0F4]">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition">{img.name}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload from device */}
            <div>
              <p className="text-xs text-[#95989D] mb-3">Upload from your device</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-[120px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#CBD5E1] rounded-xl text-[#575864] hover:border-[#2275fc] hover:text-[#2275fc] transition cursor-pointer bg-[#F8FAFC]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-sm font-medium">Click to upload images</span>
                <span className="text-[11px]">PNG, JPG, WEBP up to 5MB</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </div>

            {/* Image URL */}
            <div>
              <p className="text-xs text-[#95989D] mb-3">Or add from URL</p>
              <div className="flex gap-2">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 px-[16px] py-[10px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
                <button type="button" onClick={addImageUrl} disabled={!imageUrl.trim()} className="h-[42px] px-4 bg-[#2275fc] text-white text-sm font-semibold rounded-xl hover:bg-[#1a5fcf] transition disabled:opacity-50 flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add
                </button>
              </div>
            </div>

            {images.length === 0 && (
              <p className="text-xs text-[#95989D] text-center py-4">No images added yet. Upload from device or add via URL.</p>
            )}
          </div>

          {/* Submit */}
          <div className="bg-white rounded-[14px] p-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)] space-y-4">
            <h5 className="text-lg font-bold text-[#111]">Publish</h5>
            <p className="text-xs text-[#575864]">Review all product details before publishing. You can edit anytime.</p>
            <button type="submit" disabled={submitting} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] border border-[#2275fc] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Publishing...</>
              ) : "Publish Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
