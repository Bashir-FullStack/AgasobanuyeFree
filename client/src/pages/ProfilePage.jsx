import { useState, useEffect } from "react";
import { API } from "../config";
import { FiUser, FiMail, FiLock, FiSave, FiCamera, FiPackage, FiHeart, FiMapPin, FiLogOut, FiCreditCard, FiBell, FiSettings, FiTrash2, FiGlobe, FiClock, FiStar, FiChevronRight, FiPlus, FiCheck, FiToggleLeft, FiToggleRight, FiShield, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const tabs = [
  { id: "personal", label: "Personal Info", icon: FiUser },
  { id: "orders", label: "Order History", icon: FiPackage },
  { id: "addresses", label: "Addresses", icon: FiMapPin },
  { id: "payment", label: "Payment Methods", icon: FiCreditCard },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "security", label: "Security", icon: FiLock },
  { id: "account", label: "Account Settings", icon: FiSettings },
];

const recentOrders = [
  { id: "ORD-2026-001", date: "May 15, 2026", status: "Delivered", total: 167700, items: 3 },
  { id: "ORD-2026-002", date: "May 18, 2026", status: "Shipped", total: 84500, items: 1 },
  { id: "ORD-2026-003", date: "May 20, 2026", status: "Processing", total: 253500, items: 2 },
];

const savedCards = [
  { id: 1, brand: "Visa", last4: "8842", exp: "08/27", name: "John Doe", default: true },
  { id: 2, brand: "Mastercard", last4: "4412", exp: "03/26", name: "John Doe", default: false },
];

const activityLog = [
  { action: "Password changed", date: "May 20, 2026", icon: FiLock },
  { action: "New address added (Office)", date: "May 18, 2026", icon: FiMapPin },
  { action: "Order ORD-2026-001 delivered", date: "May 15, 2026", icon: FiPackage },
  { action: "Account created", date: "Jan 10, 2026", icon: FiUser },
];

const statusLabel = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
};

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, reviews: 0 });
  const [saved, setSaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPromo, setNotifPromo] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("classyshop_token");
    if (!token) return;
    fetch(`${API}/auth/me/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.orders !== undefined) setStats(d); }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("classyshop_token");
    try {
      const res = await fetch(`${API}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), phone }),
      });
      if (res.ok) {
        const updated = await res.json();
        updateUser({ name: updated.name, phone: updated.phone });
      }
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TabIcon = tabs.find(t => t.id === activeTab)?.icon || FiUser;

  const Toggle = ({ on, setOn }) => (
    <button onClick={() => setOn(!on)} className={`relative w-10 h-5 rounded-full transition ${on ? "bg-primary" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition ${on ? "translate-x-5" : ""}`} />
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg shadow-primary/20" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/20">
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark">{user?.name || "User"}</h1>
              <p className="text-sm text-gray-500">{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-0.5">
                {tabs.slice(0, 4).map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === t.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}>
                    <t.icon size={17} /> {t.label}
                  </button>
                ))}

                <div className="border-t border-gray-100 my-1.5" />

                {tabs.slice(4).map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === t.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}>
                    <t.icon size={17} /> {t.label}
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2 p-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-dark">{stats.orders}</p>
                      <p className="text-[10px] text-gray-500">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-dark">{stats.wishlist}</p>
                      <p className="text-[10px] text-gray-500">Wishlist</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-dark">{stats.reviews}</p>
                      <p className="text-[10px] text-gray-500">Reviews</p>
                    </div>
                  </div>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
                  <FiLogOut size={17} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <TabIcon size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-dark">{tabs.find(t => t.id === activeTab)?.label}</h2>
              </div>

              {activeTab === "personal" && (
                <form onSubmit={handleSave} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-dark mb-3">Preferences</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                      <span className="text-sm text-gray-700">Subscribe to Newsletter</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiSave size={15} /> Save Changes</button>
                    {saved && <span className="text-green-600 text-sm font-medium animate-pulse">Saved!</span>}
                  </div>
                </form>
              )}

              {activeTab === "orders" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-gray-500">Your recent orders and their current status.</p>
                    <Link to="/orders" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">View All <FiChevronRight size={14} /></Link>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition">
                        <div className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${o.status === "Delivered" ? "bg-green-50" : o.status === "Shipped" ? "bg-blue-50" : "bg-yellow-50"}`}>
                            <FiPackage size={16} className={o.status === "Delivered" ? "text-green-500" : o.status === "Shipped" ? "text-blue-500" : "text-yellow-500"} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-dark">#{o.id}</p>
                            <p className="text-xs text-gray-400">{o.date} — {o.items} items</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusLabel[o.status]}`}>{o.status}</span>
                          <span className="text-sm font-bold text-primary">FRw {o.total.toLocaleString()}</span>
                          <Link to={`/order-tracking?id=${o.id}`} className="text-xs text-primary font-medium hover:underline">Details</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Home", addr: "KG 123 St, Kigali, Rwanda", default: true },
                      { label: "Office", addr: "KN 456 Blvd, Kigali, Rwanda", default: false },
                    ].map((a) => (
                      <div key={a.label} className={`rounded-xl border-2 p-5 ${a.default ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-dark">{a.label}</h4>
                          {a.default && <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-sm text-gray-500">{a.addr}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs">
                          <button className="text-primary hover:underline">Edit</button>
                          <button className="text-gray-400 hover:text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition">
                    <FiMapPin size={16} /> Add New Address
                  </button>
                </div>
              )}

              {activeTab === "payment" && (
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    {savedCards.map((c) => (
                      <div key={c.id} className={`rounded-xl border-2 p-4 flex items-center justify-between ${c.default ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-[8px] font-bold text-white tracking-widest shadow-sm">{c.brand === "Visa" ? "VISA" : "MC"}</div>
                          <div>
                            <p className="text-sm font-semibold text-dark">{c.brand} •••• {c.last4}</p>
                            <p className="text-xs text-gray-400">Expires {c.exp} — {c.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {c.default && <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Default</span>}
                          <button className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition">
                    <FiPlus size={16} /> Add Payment Method
                  </button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="p-6 space-y-5">
                  <p className="text-sm text-gray-500">Choose which notifications you receive.</p>
                  <div className="space-y-4">
                    {[
                      { label: "Order Updates", desc: "Shipping confirmations, delivery status", key: "order", state: true, set: () => {} },
                      { label: "Email Notifications", desc: "Receive order updates via email", key: "email", state: notifEmail, set: setNotifEmail },
                      { label: "SMS Notifications", desc: "Receive order updates via SMS", key: "sms", state: notifSms, set: setNotifSms },
                      { label: "Promotions & Offers", desc: "Sales, new arrivals, and exclusive deals", key: "promo", state: notifPromo, set: setNotifPromo },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="text-sm font-semibold text-dark">{n.label}</p>
                          <p className="text-xs text-gray-400">{n.desc}</p>
                        </div>
                        <Toggle on={n.state} setOn={n.set} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleSave} className="p-6 space-y-5">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700 mb-2">
                    <strong>Tip:</strong> Use a strong password with at least 8 characters, including letters, numbers, and symbols.
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                      <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                      <input type="password" placeholder="Re-enter new password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-gray-50/50" />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2"><FiShield size={15} /> Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-semibold text-dark">Two-Factor Auth</p>
                        <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <Toggle on={twoFactor} setOn={setTwoFactor} />
                    </div>
                  </div>

                  <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiLock size={15} /> Update Password</button>
                </form>
              )}

              {activeTab === "account" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-dark mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {activityLog.map((a, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <a.icon size={14} className="text-gray-500" />
                          </div>
                          <span className="flex-1">{a.action}</span>
                          <span className="text-xs text-gray-400">{a.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-dark mb-3">Region</h3>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-sm text-gray-700">Currency: <span className="font-semibold text-dark">Rwandan Franc (FRw)</span></p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-dark mb-3">Danger Zone</h3>
                    <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50/50">
                      <div className="flex items-start gap-4">
                        <FiAlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-red-700">Delete Account</p>
                          <p className="text-xs text-red-600 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                          {!showDeleteConfirm ? (
                            <button onClick={() => setShowDeleteConfirm(true)} className="mt-3 flex items-center gap-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition shadow-sm"><FiTrash2 size={14} /> Delete My Account</button>
                          ) : (
                            <div className="mt-3 flex items-center gap-3">
                              <p className="text-xs text-red-600 font-medium">Are you sure? </p>
                              <button className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition">Yes, Delete</button>
                              <button onClick={() => setShowDeleteConfirm(false)} className="text-xs font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg transition">Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
