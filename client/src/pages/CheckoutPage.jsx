import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiTruck, FiShield, FiCheck } from "react-icons/fi";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../utils/api";
import { API } from "../config";
import StripeCheckout from "../components/StripeCheckout";

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const stripeRef = useRef();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const { data: deliveryData } = useFetch("/delivery/locations");
  const { data: deliverySettings } = useFetch("/delivery/settings");
  const deliveryLocations = deliveryData || {};
  const freeThreshold = deliverySettings?.freeThreshold || null;

  const provinces = Object.keys(deliveryLocations);

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    address: "",
    province: "",
    sector: "",
    country: "Rwanda",
  });

  const sectors = form.province ? deliveryLocations[form.province] || [] : [];
  const selectedSector = sectors.find(s => s.sector === form.sector);
  const deliveryPrice = selectedSector ? selectedSector.price : 0;
  const actualShipping = freeThreshold && total >= freeThreshold ? 0 : deliveryPrice;

  const couponDiscount = appliedCoupon ? (appliedCoupon.type === "percentage" ? (total * appliedCoupon.value) / 100 : appliedCoupon.value) : 0;
  const grandTotal = Math.max(0, total + actualShipping - couponDiscount);

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-[1430px] mx-auto px-4 text-center py-32">
          <h2 className="text-2xl font-bold text-dark mb-3">Sign in to checkout</h2>
          <p className="text-gray-500 text-sm mb-8">Please log in to proceed with your order.</p>
          <Link to="/login?redirect=/checkout" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">Sign In</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-[1430px] mx-auto px-4 text-center py-32">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
            <FiCheck size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">Order Placed Successfully!</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Thank you for your purchase. You will receive a confirmation email shortly. You can track your delivery status in your orders.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/orders" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">View Orders</Link>
            <Link to="/shop" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-8 py-3 rounded-xl text-sm font-semibold hover:border-primary transition">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-[1430px] mx-auto px-4 text-center py-32">
          <h2 className="text-2xl font-bold text-dark mb-3">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Add some products before checking out.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">Browse Products</Link>
        </div>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`${API}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: total }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error || "Invalid coupon"); setAppliedCoupon(null); return; }
      setAppliedCoupon(data);
      setCouponError("");
    } catch { setCouponError("Failed to validate coupon"); }
    finally { setCouponLoading(false); }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      let paymentIntentId = null;

      if (paymentMethod === "Credit/Debit Card") {
        paymentIntentId = await stripeRef.current?.confirmPayment();
        if (!paymentIntentId) { setSubmitting(false); return; }
      }

      const token = localStorage.getItem("classyshop_token");
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.id || i._id,
            quantity: i.qty,
            price: i.price,
          })),
          payment: paymentMethod,
          stripePaymentIntentId: paymentIntentId,
          address: form,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          delivery: {
            province: form.province,
            sector: form.sector,
            price: actualShipping,
          },
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      clearCart();
      setDone(true);
    } catch (err) {
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/cart" className="hover:text-primary">Cart</Link><span>/</span><span className="text-gray-700 font-medium">Checkout</span>
        </div>

        <div className="flex items-center justify-center gap-0 mb-8">
          {[{ n: 1, l: "Shipping" }, { n: 2, l: "Payment" }, { n: 3, l: "Confirm" }].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${step >= s.n ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{s.n}</span> {s.l}
              </div>
              {i < 2 && <div className={`w-12 h-0.5 mx-1 ${step > s.n ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input type="text" value={form.firstName} onChange={e => update("firstName", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input type="text" value={form.lastName} onChange={e => update("lastName", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" /></div>
                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" /></div>
                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" /></div>

                  {/* Delivery Location */}
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <select value={form.province} onChange={e => { update("province", e.target.value); update("sector", ""); }} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary">
                      <option value="">Select Province</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="relative"><label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                    <input
                      value={form.sector}
                      onChange={e => update("sector", e.target.value)}
                      disabled={!form.province}
                      placeholder={form.province ? "Type to search sector..." : "Select province first"}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {form.province && form.sector.length > 0 && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {sectors
                          .filter(s => s.sector.toLowerCase().includes(form.sector.toLowerCase()))
                          .map(s => (
                            <button
                              key={s._id}
                              type="button"
                              onClick={() => update("sector", s.sector)}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition ${form.sector.toLowerCase() === s.sector.toLowerCase() ? "bg-primary/5 text-primary font-semibold" : "text-gray-700"}`}
                            >
                              <span className="font-medium">{s.sector}</span>
                              <span className="text-gray-400 ml-2">{toRWF(s.price)}</span>
                            </button>
                          ))}
                        {sectors.filter(s => s.sector.toLowerCase().includes(form.sector.toLowerCase())).length === 0 && (
                          <p className="px-3 py-2 text-sm text-gray-400">No sectors match "{form.sector}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label><input type="text" value={form.address} onChange={e => update("address", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary" /></div>
                  <div className="flex items-end"><button onClick={() => setStep(2)} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition">Continue to Payment</button></div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { name: "Credit/Debit Card", icon: FiCreditCard, desc: "Pay with Visa, Mastercard, or American Express" },
                    { name: "Mobile Money", icon: FiCreditCard, desc: "Pay with MTN Mobile Money or Airtel Money" },
                    { name: "Cash on Delivery", icon: FiTruck, desc: "Pay when you receive your order" },
                  ].map((m) => (
                    <label key={m.name} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition ${paymentMethod === m.name ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                      <input type="radio" name="payment" checked={paymentMethod === m.name} onChange={() => setPaymentMethod(m.name)} className="mt-1 accent-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-dark text-sm">{m.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                        {m.name === "Credit/Debit Card" && paymentMethod === m.name && (
                          <div className="mt-3">
                            <StripeCheckout
                              ref={stripeRef}
                              amount={grandTotal}
                              customer={{ name: `${form.firstName} ${form.lastName}`, email: form.email }}
                              onError={(msg) => setStripeError(msg)}
                            />
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary">Back</button>
                  <button onClick={() => setStep(3)} disabled={!paymentMethod} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Confirm Order</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiTruck className="text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-dark">Shipping to</p>
                      <p className="text-xs text-gray-500">{form.firstName} {form.lastName}, {form.address}, {form.sector}, {form.province}, Rwanda</p>
                      <p className="text-xs text-gray-500 mt-1">Delivery: {actualShipping === 0 ? (freeThreshold && total >= freeThreshold ? "FREE (above threshold)" : "FREE") : toRWF(actualShipping)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><FiCreditCard className="text-primary mt-0.5" /><div><p className="text-sm font-medium text-dark">Payment</p><p className="text-xs text-gray-500">{paymentMethod}</p></div></div>
                </div>
                <div className="space-y-2 border-t pt-4">
                  {items.map((item) => (
                    <div key={item.id || item._id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1 min-w-0"><p className="text-sm text-gray-600 truncate">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.qty}</p></div>
                      <span className="text-sm font-medium text-dark">{toRWF(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                {stripeError && <p className="text-xs text-red-500 mt-2">{stripeError}</p>}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-primary">Back</button>
                  <button onClick={handlePlaceOrder} disabled={submitting} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
                    <FiShield /> {submitting ? "Placing Order..." : `Place Order - ${toRWF(grandTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-dark mb-4">Order Summary ({count} items)</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id || item._id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-xs text-gray-600 truncate">{item.name}</p><span className="text-xs text-gray-400">Qty: {item.qty}</span></div>
                    <span className="text-xs font-medium text-dark">{toRWF(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{toRWF(total)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={actualShipping === 0 ? "text-green-600" : "text-dark"}>{actualShipping === 0 ? "FREE" : toRWF(actualShipping)}</span>
                </div>
                {freeThreshold && total < freeThreshold && selectedSector && (
                  <p className="text-[10px] text-gray-400">Free delivery on orders over {toRWF(freeThreshold)}</p>
                )}

                {/* Coupon */}
                <div className="border-t pt-3">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div><span className="text-xs font-semibold text-green-700">Coupon: {appliedCoupon.code}</span><span className="text-xs text-green-600 ml-2">-{toRWF(couponDiscount)}</span></div>
                      <button onClick={removeCoupon} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon code" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary" />
                      <button onClick={applyCoupon} disabled={couponLoading} className="px-3 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50">{couponLoading ? "..." : "Apply"}</button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-dark"><span>Total</span><span>{toRWF(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
