import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";

export default function DeliveryPage() {
  const { token } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [sector, setSector] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [settings, setSettings] = useState({ freeThreshold: "" });

  const fetchLocations = () => {
    setLoading(true);
    fetch(`${API}/admin/delivery-locations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setLocations(d); setLoading(false); });
  };

  const fetchSettings = () => {
    fetch(`${API}/delivery/settings`)
      .then(r => r.json()).then(d => { setSettings({ freeThreshold: d?.freeThreshold || "" }); });
  };

  useEffect(() => { fetchLocations(); fetchSettings(); }, []);

  const saveSettings = async () => {
    await fetch(`${API}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ delivery: { freeThreshold: Number(settings.freeThreshold) || null } }),
    });
    alert("Settings saved");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!province.trim() || !sector.trim() || !price) return;
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/admin/delivery-locations/${editId}` : `${API}/admin/delivery-locations`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ province: province.trim(), sector: sector.trim(), price: Number(price) }),
    });

    setProvince(""); setSector(""); setPrice(""); setEditId(null); setShowForm(false); fetchLocations();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this location?")) return;
    await fetch(`${API}/admin/delivery-locations/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchLocations();
  };

  const openEdit = (loc) => {
    setEditId(loc._id);
    setProvince(loc.province);
    setSector(loc.sector);
    setPrice(String(loc.price));
    setShowForm(true);
  };

  const grouped = {};
  for (const loc of locations) {
    if (!grouped[loc.province]) grouped[loc.province] = [];
    grouped[loc.province].push(loc);
  }

  return (
    <div className="space-y-[30px]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Delivery Locations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{locations.length} sectors configured</p>
        </div>
        <button onClick={() => { setEditId(null); setProvince(""); setSector(""); setPrice(""); setShowForm(true); }} className="h-[50px] px-5 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Location
        </button>
      </div>

      {/* Settings */}
      <div className="rounded-[14px] p-5 space-y-3" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
        <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Delivery Settings</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--text-secondary)" }}>Free Delivery Threshold (FRw)</label>
            <input value={settings.freeThreshold} onChange={(e) => setSettings({ ...settings, freeThreshold: e.target.value })} placeholder="e.g. 100000" className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)] w-full" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
          </div>
          <button onClick={saveSettings} className="h-[50px] px-5 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all">Save</button>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Orders above this amount get free delivery. Leave empty to disable.</p>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{editId ? "Edit Location" : "New Location"}</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); setProvince(""); setSector(""); setPrice(""); }} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <select value={province} onChange={(e) => { setProvince(e.target.value); setSector(""); }} required className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}>
              <option value="">Select Province</option>
              {["Kigali City", "Eastern Province", "Western Province", "Northern Province", "Southern Province"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div>
              <input list={province ? `sectors-${province}` : undefined} value={sector} onChange={(e) => setSector(e.target.value)} placeholder={province ? "Select or type sector" : "Select province first"} required={!sector && !province} disabled={!province} className="w-full border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)] disabled:opacity-50" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
              {province && (
                <datalist id={`sectors-${province}`}>
                  {locations.filter(l => l.province === province).map(l => (
                    <option key={l._id} value={l.sector} />
                  ))}
                </datalist>
              )}
            </div>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Delivery price (FRw)" type="number" required className="border rounded-xl px-[22px] py-[14px] text-sm outline-none focus:border-[#2275fc] transition placeholder:text-[var(--text-muted)]" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }} />
            <div className="flex gap-3 items-end">
              <button type="submit" className="bg-[#2275fc] text-white px-6 py-[14px] rounded-xl text-sm font-bold hover:bg-[#1a5fcf] transition-all">{editId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setProvince(""); setSector(""); setPrice(""); }} className="border px-6 py-[14px] rounded-xl text-sm font-semibold hover:bg-[var(--bg-input)] transition" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-[#2275fc] border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="space-y-6">
          {Object.keys(grouped).length === 0 && <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>No delivery locations yet</div>}
          {Object.entries(grouped).map(([prov, items]) => (
            <div key={prov} className="rounded-[14px] border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "var(--shadow)" }}>
              <h3 className="text-base font-bold mb-3" style={{ color: "var(--text-primary)" }}>{prov} Province</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left border-b" style={{ borderColor: "var(--border-color)" }}><th className="pb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Sector</th><th className="pb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Price (FRw)</th><th className="pb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>Actions</th></tr></thead>
                  <tbody>{items.map(item => (
                    <tr key={item._id} className="border-b" style={{ borderColor: "var(--border-color)" }}>
                      <td className="py-3" style={{ color: "var(--text-primary)" }}>{item.sector}</td>
                      <td className="py-3 font-semibold" style={{ color: "var(--text-primary)" }}>{Number(item.price).toLocaleString()}</td>
                      <td className="py-3 flex gap-2">
                        <button onClick={() => openEdit(item)} className="text-xs font-semibold text-[#2275fc] hover:bg-[#EEF5FF] px-3 py-1.5 rounded-lg transition">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">Delete</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
