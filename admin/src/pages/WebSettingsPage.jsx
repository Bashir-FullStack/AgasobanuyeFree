import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";

const tabs = ["Branding", "General", "SEO", "Social Links", "Payment"];

export default function WebSettingsPage() {
  const { token } = useAuth();
  const fileRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Branding");
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "Hiromart",
    tagline: "Shop Smart, Live Well",
    email: "admin@hiromart.com",
    phone: "+1 (555) 000-0000",
    address: "123 Commerce St, New York, NY 10001",
    currency: "RWF",
    timezone: "America/New_York",
    metaTitle: "Hiromart - Best Online Shopping",
    metaDescription: "Shop the latest trends at hiromart. Premium quality products at great prices.",
    favicon: "https://i.pinimg.com/736x/c4/e5/28/c4e5282b9c9c3f188fcf3df08ae6f1c6.jpg",
    facebook: "https://facebook.com/hiromart",
    twitter: "https://twitter.com/hiromart",
    instagram: "https://instagram.com/hiromart",
    youtube: "https://youtube.com/@hiromart",
    linkedin: "https://linkedin.com/company/hiromart",
    tiktok: "https://tiktok.com/@hiromart",
    stripeKey: "pk_test_xxxxxxxxxxxx",
    paypalEmail: "payments@hiromart.com",
  });

  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object") {
          setForm(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleLogoUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setLogo({ file: f, preview: URL.createObjectURL(f) });
  };

  const handleFaviconUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) setFavicon({ file: f, preview: URL.createObjectURL(f) });
  };

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/settings/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let data = { ...form };
      if (favicon?.file) data.favicon = await uploadFile(favicon.file);
      if (logo?.file) data.logo = await uploadFile(logo.file);
      const res = await fetch(`${API}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFavicon(null);
        setLogo(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to save");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-[22px] py-[14px] text-sm rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]";
  const labelClass = "block text-sm font-bold mb-2.5";
  const cardClass = "rounded-[14px] p-6 space-y-5";

  return (
    <div className="space-y-[30px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Web Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your site branding, SEO, and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-[12px] text-sm font-semibold rounded-xl transition-all ${activeTab === tab ? "bg-[#2275fc] text-white shadow-lg" : "text-[var(--text-secondary)] border hover:border-[#2275fc]"}`}
            style={{ backgroundColor: activeTab === tab ? undefined : "var(--bg-card)", borderColor: activeTab === tab ? "transparent" : "var(--border-color)" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {activeTab === "Branding" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
            <div className="xl:col-span-2 space-y-[30px]">
              <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Site Identity</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>Site Name</label>
                    <input value={form.siteName} onChange={update("siteName")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>Tagline</label>
                    <input value={form.tagline} onChange={update("tagline")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                  </div>
                </div>
              </div>
              <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Brand Colors</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" defaultValue="#2275fc" className="w-12 h-12 rounded-xl border cursor-pointer" style={{ borderColor: "var(--border-color)" }} />
                      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>#2275fc</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" defaultValue="#FF5200" className="w-12 h-12 rounded-xl border cursor-pointer" style={{ borderColor: "var(--border-color)" }} />
                      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>#FF5200</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" defaultValue="#22C55E" className="w-12 h-12 rounded-xl border cursor-pointer" style={{ borderColor: "var(--border-color)" }} />
                      <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>#22C55E</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-[30px]">
              <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <h5 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>Site Logo</h5>
                {logo ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border group" style={{ borderColor: "var(--border-color)" }}>
                    <img src={logo.preview} alt="Logo" className="w-full h-full object-contain" style={{ backgroundColor: "var(--bg-page)" }} />
                    <button type="button" onClick={() => setLogo(null)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl transition cursor-pointer" style={{ borderColor: "var(--text-muted)", color: "var(--text-secondary)", backgroundColor: "var(--bg-page)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-sm font-medium">Upload Logo</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <div className="mt-4">
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Or Logo URL</label>
                  <input value={form.logo || ""} onChange={update("logo")} placeholder="https://..." className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                  {form.logo && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.logo} alt="" className="h-10 rounded object-contain border" style={{ borderColor: "var(--border-color)" }} onError={(e) => { e.target.style.display = "none" }} />
                      <span className="text-xs text-gray-400">Preview</span>
                    </div>
                  )}
                </div>
              </div>
              <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <h5 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>Favicon</h5>
                {favicon ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border group mx-auto" style={{ borderColor: "var(--border-color)" }}>
                    <img src={favicon.preview} alt="Favicon" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFavicon(null)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs">✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => document.getElementById("favicon-input")?.click()} className="w-24 h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-xl transition cursor-pointer mx-auto" style={{ borderColor: "var(--text-muted)", color: "var(--text-secondary)", backgroundColor: "var(--bg-page)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-[10px]">Upload</span>
                  </button>
                )}
                <input id="favicon-input" type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                <div className="mt-4">
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Or Favicon URL</label>
                  <input value={form.favicon} onChange={update("favicon")} placeholder="https://..." className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                  {form.favicon && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.favicon} alt="" className="w-8 h-8 rounded object-cover border" onError={(e) => { e.target.style.display = "none" }} />
                      <span className="text-xs text-gray-400">Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "General" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
            <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>General Information</h5>
              <div className="space-y-4">
                {["siteName", "tagline", "email", "phone", "address"].map((field) => (
                  <div key={field}>
                    <label className={labelClass} style={{ color: "var(--text-primary)" }}>{field === "siteName" ? "Site Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input value={form[field]} onChange={update(field)} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                  </div>
                ))}
              </div>
            </div>
            <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Regional Settings</h5>
              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Currency</label>
                  <select value={form.currency} onChange={update("currency")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                    <option value="RWF">RWF - Rwandan Franc</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="RWF">RWF - Rwandan Franc</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Timezone</label>
                  <select value={form.timezone} onChange={update("timezone")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="Africa/Kigali">Africa/Kigali</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Date Format</label>
                  <select className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>SEO Settings</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelClass} style={{ color: "var(--text-primary)" }}>Meta Title</label>
                <input value={form.metaTitle} onChange={update("metaTitle")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={{ color: "var(--text-primary)" }}>Meta Description</label>
                <textarea value={form.metaDescription} onChange={update("metaDescription")} rows={3} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={{ color: "var(--text-primary)" }}>Google Analytics ID</label>
                <input placeholder="G-XXXXXXXXXX" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Social Links" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px]">
            {[
              { field: "facebook", label: "Facebook URL", icon: "f" },
              { field: "twitter", label: "Twitter / X URL", icon: "𝕏" },
              { field: "instagram", label: "Instagram URL", icon: "📷" },
              { field: "youtube", label: "YouTube URL", icon: "▶" },
              { field: "linkedin", label: "LinkedIn URL", icon: "in" },
              { field: "tiktok", label: "TikTok URL", icon: "♪" },
            ].map((s) => (
              <div key={s.field} className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{s.label}</h5>
                <input value={form[s.field]} onChange={update(s.field)} placeholder={`Enter ${s.label.toLowerCase()}`} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Payment" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px]">
            <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Stripe</h5>
              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Publishable Key</label>
                  <input value={form.stripeKey} onChange={update("stripeKey")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Secret Key</label>
                  <input type="password" placeholder="sk_test_xxxxxxxxxxxx" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
            <div className={cardClass} style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>PayPal</h5>
              <div className="space-y-4">
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>PayPal Email</label>
                  <input value={form.paypalEmail} onChange={update("paypalEmail")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-primary)" }}>Client ID</label>
                  <input placeholder="xxxxxxxxxxxxxxxxxxxx" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-[30px] flex justify-end items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-semibold animate-pulse">Saved!</span>}
          <button type="submit" disabled={saving} className="h-[50px] px-8 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all flex items-center gap-2 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
