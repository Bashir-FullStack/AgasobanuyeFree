import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "Admin",
    email: user?.email || "admin@hiromart.com",
    phone: user?.phone || "",
    bio: "Admin at Hiromart.",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      if (res.ok) {
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

  return (
    <div className="space-y-[30px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Profile</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[30px]">
        <div className="xl:col-span-2 space-y-[30px]">
          <form onSubmit={handleSave} className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Personal Information</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Full Name</label>
                <input value={form.name} onChange={update("name")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Email</label>
                <input value={form.email} onChange={update("email")} type="email" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Phone</label>
                <input value={form.phone} onChange={update("phone")} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Role</label>
                <input value="Administrator" disabled className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Bio</label>
              <textarea value={form.bio} onChange={update("bio")} rows={3} className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="h-[50px] px-6 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all">Save Changes</button>
              <button type="button" className="h-[50px] px-6 border rounded-xl text-sm font-semibold hover:bg-[var(--bg-input)] transition" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>Cancel</button>
            </div>
          </form>

          <div className="rounded-[14px] p-6 space-y-5" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Change Password</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>Current Password</label>
                <input type="password" placeholder="••••••••" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2.5" style={{ color: "var(--text-primary)" }}>New Password</label>
                <input type="password" placeholder="••••••••" className={inputClass} style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <button className="h-[50px] px-6 bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-[#1a5fcf] transition-all">Update Password</button>
          </div>
        </div>

        <div className="space-y-[30px]">
          <div className="rounded-[14px] p-6 space-y-5 text-center" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#2275fc]/20" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#2275fc] flex items-center justify-center text-white text-3xl font-bold mx-auto">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{user?.name || "Admin"}</h5>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{user?.email || "admin@hiromart.com"}</p>
            </div>
            <button className="w-full h-[44px] border border-[#ECF0F4] text-sm font-semibold rounded-xl hover:bg-[var(--bg-input)] transition" style={{ color: "var(--text-secondary)" }}>
              Upload Photo
            </button>
          </div>

          <div className="rounded-[14px] p-6 space-y-4" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
            <h5 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Account Info</h5>
            <div className="space-y-3 text-sm">
              {[
                { label: "Member Since", value: "January 2024" },
                { label: "Last Login", value: "Today, 10:30 AM" },
                { label: "Account Status", value: "Active", color: "#22C55E" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: item.color || "var(--text-primary)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
