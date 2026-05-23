import { useState } from "react";
import { FiPackage, FiSearch, FiTruck, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { useFetch } from "../utils/api";

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const paramsId = searchParams.get("id");
  const [orderId, setOrderId] = useState(paramsId || "");
  const [searched, setSearched] = useState(!!paramsId);
  const [activeId, setActiveId] = useState(paramsId || null);

  const { data: tracking, loading } = useFetch(activeId ? `/orders/${activeId}/track` : null, [activeId]);

  const handleTrack = (e) => {
    e.preventDefault();
    setSearched(true);
    setActiveId(orderId.trim() || null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[600px] mx-auto px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><FiPackage size={28} className="text-primary" /></div>
          <h1 className="text-3xl font-bold text-dark">Order Tracking</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your order ID to track your shipment.</p>
          <form onSubmit={handleTrack} className="mt-6 flex items-center gap-2">
            <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter order ID (e.g. ORD-2026-001)" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition shadow-sm" />
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm flex items-center gap-2"><FiSearch size={16} /> Track</button>
          </form>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-10">
        {loading && searched && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-dark mb-2">Loading...</h3>
            <p className="text-sm text-gray-500">Fetching your tracking information.</p>
          </div>
        )}

        {!tracking && !loading && searched && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <FiPackage size={40} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-dark mb-2">Order Not Found</h3>
            <p className="text-sm text-gray-500">Please check your order ID and try again.</p>
          </div>
        )}

        {tracking && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div><span className="text-sm font-semibold text-dark">Order #{tracking.id}</span></div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  tracking.status === "Delivered" ? "bg-green-100 text-green-700" :
                  tracking.status === "Shipped" || tracking.status === "Out for Delivery" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{tracking.status}</span>
              </div>

              {/* Delivery Map */}
              <div className="p-6">
                <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
                  <iframe
                    title="Delivery Map"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=29.5%2C-2.2%2C30.5%2C-1.8&layer=mapnik&marker=${tracking.status === "Delivered" ? "-1.95%2C30.06" : "-2.0%2C30.05"}`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-200">
                    <FiMapPin className="text-primary" size={14} />
                    {tracking.delivery?.province && tracking.delivery?.sector
                      ? `Shipping to ${tracking.delivery.sector}, ${tracking.delivery.province} Province, Rwanda`
                      : "Shipping within Rwanda"}
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="relative">
                  {tracking.events.map((e, i) => (
                    <div key={i} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${e.done ? "bg-green-50" : "bg-gray-100"}`}>
                          {e.done ? <FiCheckCircle size={16} className="text-green-500" /> : <FiClock size={16} className="text-gray-400" />}
                        </div>
                        {i < tracking.events.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                      </div>
                      <div className="pt-1"><p className="text-sm font-semibold text-dark">{e.label}</p><p className="text-xs text-gray-400">{e.date}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!searched && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <FiTruck size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-dark mb-2">Track Your Order</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your order ID above to see real-time tracking information.</p>
            <p className="text-xs text-gray-400">You can find your order ID in your order confirmation email or in <Link to="/orders" className="text-primary hover:underline">My Orders</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
