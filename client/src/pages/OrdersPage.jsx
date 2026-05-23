import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiChevronRight, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiSearch, FiBox, FiDownload, FiRotateCcw, FiCalendar, FiFilter, FiBarChart2, FiShoppingBag, FiDollarSign, FiStar, FiChevronDown } from "react-icons/fi";
import { useFetch } from "../utils/api";

const statusConfig = {
  Delivered: { icon: FiCheckCircle, color: "text-green-500", bg: "bg-green-50 border-green-200", label: "bg-green-100 text-green-700" },
  Shipped: { icon: FiTruck, color: "text-blue-500", bg: "bg-blue-50 border-blue-200", label: "bg-blue-100 text-blue-700" },
  "Out for Delivery": { icon: FiTruck, color: "text-purple-500", bg: "bg-purple-50 border-purple-200", label: "bg-purple-100 text-purple-700" },
  Processing: { icon: FiClock, color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200", label: "bg-yellow-100 text-yellow-700" },
  Pending: { icon: FiClock, color: "text-gray-500", bg: "bg-gray-50 border-gray-200", label: "bg-gray-100 text-gray-700" },
  Cancelled: { icon: FiXCircle, color: "text-red-500", bg: "bg-red-50 border-red-200", label: "bg-red-100 text-red-700" },
};

const tabs = ["All Orders", "Processing", "Shipped", "Delivered"];
const sortOptions = ["Newest First", "Oldest First", "Highest Value", "Lowest Value"];

function formatOrder(o) {
  return {
    id: o._id,
    total: o.total,
    status: o.status,
    payment: o.payment,
    deliveryStatus: o.delivery?.status || "Pending",
    deliveryProvince: o.delivery?.province || null,
    deliverySector: o.delivery?.sector || null,
    address: typeof o.address === "object" ? [o.address.firstName, o.address.lastName].filter(Boolean).join(" ") + ", " + (o.address.address || "") : o.address,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
    eta: o.createdAt ? new Date(Date.parse(o.createdAt) + 7 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
    items: o.items ? o.items.length : 0,
    products: (o.items || []).map(i => ({ image: i.image || "", name: i.name || "" })),
  };
}

import { API } from "../config";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");
  const [viewMode, setViewMode] = useState("list");
  const token = typeof window !== "undefined" ? localStorage.getItem("classyshop_token") : null;
   const [reviewModal, setReviewModal] = useState(null);
   const [invoiceModal, setInvoiceModal] = useState(null);
   const [reviewRating, setReviewRating] = useState(5);
   const [reviewComment, setReviewComment] = useState("");
   const [reviewImages, setReviewImages] = useState([]);
   const [reviewSubmitting, setReviewSubmitting] = useState(false);

   const submitReview = async () => {
     setReviewSubmitting(true);
     try {
       await fetch(`${API}/reviews`, {
         method: "POST",
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         body: JSON.stringify({ product_id: reviewModal.product_id, order_id: reviewModal.order_id, rating: reviewRating, comment: reviewComment, images: reviewImages }),
       });
       setReviewModal(null);
       setReviewComment("");
       setReviewRating(5);
       setReviewImages([]);
     } catch {} finally { setReviewSubmitting(false); }
   };

  const { data: allOrders, loading } = useFetch("/orders", [], token);
  const ordersData = (allOrders || []).map(formatOrder);

  const orders = ordersData.filter(o => {
    const matchTab = activeTab === "All Orders" || o.status === activeTab;
    const matchSearch = !search || (o.id && o.id.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const stats = [
    { label: "Total Orders", value: ordersData.length, icon: FiShoppingBag, color: "text-primary bg-primary/10" },
    { label: "Completed", value: ordersData.filter(o => o.status === "Delivered").length, icon: FiCheckCircle, color: "text-green-500 bg-green-50" },
    { label: "In Progress", value: ordersData.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length, icon: FiClock, color: "text-yellow-500 bg-yellow-50" },
    { label: "Total Spent", value: `FRw ${ordersData.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}`, icon: FiDollarSign, color: "text-blue-500 bg-blue-50" },
  ];

  if (loading) return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100"><div className="max-w-[1200px] mx-auto px-4 py-8"><div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" /><div className="h-4 w-64 bg-gray-200 rounded-lg mt-2 animate-pulse" /></div></div>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" /><div className="grid grid-cols-2 gap-3"><div className="h-20 rounded-xl bg-gray-100 animate-pulse" /><div className="h-20 rounded-xl bg-gray-100 animate-pulse" /><div className="h-20 rounded-xl bg-gray-100 animate-pulse" /><div className="h-20 rounded-xl bg-gray-100 animate-pulse" /></div></div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-3" /><div className="space-y-2"><div className="h-10 rounded-lg bg-gray-100 animate-pulse" /><div className="h-10 rounded-lg bg-gray-100 animate-pulse" /></div></div>
          </div>
          <div className="flex-1 space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3" /><div className="h-4 w-full bg-gray-100 rounded animate-pulse" /></div>)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <FiPackage size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark">My Orders</h1>
                <p className="text-sm text-gray-500">Track, manage, and review your purchases</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-56">
                <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition bg-white" />
              </div>
              <Link to="/shop" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiShoppingBag size={15} /> Shop</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:w-72 shrink-0">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
                      <s.icon size={16} />
                      <p className="text-lg font-bold text-dark mt-1">{s.value}</p>
                      <p className="text-[10px] text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Filters</h3>
                <div className="space-y-1">
                  {[
                    { label: "This Week", icon: FiCalendar },
                    { label: "This Month", icon: FiCalendar },
                    { label: "Last 3 Months", icon: FiCalendar },
                    { label: "This Year", icon: FiCalendar },
                  ].map((f) => (
                    <button key={f.label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition">
                      <f.icon size={14} className="text-gray-400" /> {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Links</h3>
                <div className="space-y-1">
                  <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition"><FiBarChart2 size={14} className="text-gray-400" /> Account Dashboard</Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition"><FiStar size={14} className="text-gray-400" /> Wishlist</Link>
                  <Link to="/help" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition"><FiRotateCcw size={14} className="text-gray-400" /> Returns & Help</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-5">
              <div className="flex items-center gap-1">
                {tabs.map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${activeTab === t ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-primary"}`}>
                    {t} {t !== "All Orders" && <span className="ml-1 text-[10px] opacity-70">({ordersData.filter(o => t === "All Orders" || o.status === t).length})</span>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border border-gray-200 rounded-lg p-0.5">
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}><FiBarChart2 size={14} /></button>
                  <button onClick={() => setViewMode("compact")} className={`p-1.5 rounded ${viewMode === "compact" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"}`}><FiBox size={14} /></button>
                </div>
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary transition">
                    <FiFilter size={13} /> {sortBy} <FiChevronDown size={12} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-gray-100 rounded-xl py-1 w-40 z-30" onMouseLeave={() => setSortOpen(false)}>
                      {sortOptions.map((o) => (
                        <button key={o} onClick={() => { setSortBy(o); setSortOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === o ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}>{o}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiBox size={36} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">No orders found</h3>
                <p className="text-gray-500 text-sm mb-6">Try a different search or filter.</p>
                <Link to="/shop" className="inline-flex bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">Browse Products</Link>
              </div>
            ) : viewMode === "compact" ? (
              <div className="space-y-2">
                {orders.map((order) => {
                  const cfg = statusConfig[order.status] || statusConfig.Processing;
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center justify-between hover:shadow-md transition">
                      <div className="flex items-center gap-4">
                        <StatusIcon size={18} className={cfg.color} />
                        <div>
                          <p className="text-sm font-semibold text-dark">#{order.id}</p>
                          <p className="text-xs text-gray-400">{order.date} — {order.items} items</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary">FRw {order.total.toLocaleString()}</span>
                        <Link to={`/order-tracking?id=${order.id}`} className="text-xs text-primary font-medium hover:underline">View</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const cfg = statusConfig[order.status] || statusConfig.Processing;
                  const StatusIcon = cfg.icon;
                  const PROGRESS = { Processing: 25, Confirmed: 50, Shipped: 75, Delivered: 100 };
                  const progress = PROGRESS[order.status] || 0;
                  const STATUS_STEPS = ["Processing", "Confirmed", "Shipped", "Delivered"];
                  const currentStep = STATUS_STEPS.indexOf(order.status);

                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition group">
                      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.label}`}>
                            <StatusIcon size={14} /> {order.status}
                          </span>
                          <div className="hidden sm:block text-xs text-gray-400">#{order.id}</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{order.date}</span>
                          <span className="text-gray-300">|</span>
                          <span>{order.payment}</span>
                        </div>
                      </div>

                      <div className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {order.products.slice(0, 3).map((p, i) => (
                              <div key={i} className="w-16 h-16 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm group-hover:shadow-md transition">
                                <img src={p.image} alt="" className="w-full h-full object-contain p-1.5" />
                              </div>
                            ))}
                            {order.items > 3 && (
                              <div className="w-16 h-16 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">
                                +{order.items - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-dark">{order.items} {order.items === 1 ? "item" : "items"}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Deliver to: {order.address}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">FRw {order.total.toLocaleString()}</p>
                                {order.eta && <p className="text-xs text-gray-400">Est. <span className="font-medium text-gray-600">{order.eta}</span></p>}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${order.status === "Delivered" ? "bg-green-500" : order.status === "Shipped" ? "bg-blue-500" : order.status === "Confirmed" ? "bg-purple-500" : "bg-yellow-500"}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500 w-16 text-right">{order.status === "Delivered" ? "Delivered" : `${progress}%`}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                            {STATUS_STEPS.map((s, i) => (
                              <span key={s} className="flex flex-col items-center">
                                {i <= currentStep ? <FiCheckCircle size={11} className="text-green-500" /> : <FiClock size={11} className="text-gray-300" />}
                                <span className="mt-0.5">{s === "Processing" ? "Ordered" : s}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Link to={`/order-tracking?id=${order.id}`} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">View Details <FiChevronRight size={12} /></Link>
                            {order.status === "Delivered" && (
                              <>
                                <button onClick={() => { setReviewModal(order); setReviewRating(5); setReviewComment(""); }} className="text-xs text-gray-500 hover:text-primary font-medium flex items-center gap-1"><FiStar size={12} /> Review</button>
                                <button className="text-xs text-gray-500 hover:text-primary font-medium flex items-center gap-1"><FiRotateCcw size={12} /> Return</button>
                              </>
                            )}
                          </div>
                          <button onClick={() => setInvoiceModal(order)} className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"><FiDownload size={12} /> Invoice</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {orders.length > 0 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
                <span className="text-sm text-gray-500">Showing {orders.length} of {ordersData.length} orders</span>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-lg text-sm border border-gray-200 text-gray-400 cursor-not-allowed opacity-50">‹</button>
                  <button className="w-8 h-8 rounded-lg text-sm bg-primary text-white">1</button>
                  <button className="w-8 h-8 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-primary">2</button>
                  <button className="w-8 h-8 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-primary">3</button>
                  <button className="w-8 h-8 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-primary">›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setReviewModal(null)}>
           <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
             <h3 className="font-bold text-dark text-lg mb-1">Rate this product</h3>
             <p className="text-xs text-gray-500 mb-4">{reviewModal.products?.[0]?.name || "Product from order"}</p>
             <div className="flex gap-1 text-2xl mb-4 justify-center">
               {[1,2,3,4,5].map(n => (
                 <button key={n} onClick={() => setReviewRating(n)} className={n <= reviewRating ? "text-yellow-400" : "text-gray-300"}>{n <= reviewRating ? "★" : "☆"}</button>
               ))}
             </div>
             <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write your review (optional)..." rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary mb-4 resize-none" />
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-2">Upload Review Images (Optional)</label>
               <div className="flex flex-wrap gap-2">
                 <div className="relative w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition">
                   <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => {
                     const files = Array.from(e.target.files);
                     setReviewImages(prev => {
                       const newImages = prev.concat(files);
                       if (newImages.length > 5) return prev;
                       return newImages;
                     });
                   }} />
                   <div className="flex items-center justify-center h-full">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M12 4v13M8 12h13" />
                     </svg>
                   </div>
                 </div>
                 {reviewImages.map((img, index) => {
                   if (img instanceof File || typeof img === 'object') {
                     const url = URL.createObjectURL(img);
                     return (
                       <div key={index} className="relative w-24 h-24">
                         <img src={url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                         <button onClick={() => {
                           setReviewImages(prev => prev.filter((_, i) => i !== index));
                           URL.revokeObjectURL(url);
                         }} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                           ✕
                         </button>
                       </div>
                     );
                   }
                   return null;
                 })}
               </div>
             </div>
            <div className="flex gap-2">
              <button onClick={() => setReviewModal(null)} className="flex-1 border border-gray-200 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={submitReview} disabled={reviewSubmitting} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark disabled:opacity-50">{reviewSubmitting ? "Submitting..." : "Submit Review"}</button>
            </div>
          </div>
        </div>
      )}

      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setInvoiceModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark text-lg">Invoice</h3>
              <button onClick={() => setInvoiceModal(null)} className="text-gray-400 hover:text-gray-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-semibold text-dark">#{invoiceModal.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold text-dark">{invoiceModal.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold text-dark">{invoiceModal.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-semibold text-dark">{invoiceModal.payment || "—"}</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between"><span className="text-gray-500 font-semibold">Total</span><span className="text-lg font-bold text-primary">FRw {(invoiceModal.total || 0).toLocaleString()}</span></div>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
              {(invoiceModal.products || []).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded object-cover" />}
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-dark truncate">{p.name}</p></div>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition">Print Invoice</button>
          </div>
        </div>
      )}
    </div>
  );
}
