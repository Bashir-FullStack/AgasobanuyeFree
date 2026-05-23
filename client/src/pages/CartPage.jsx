import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiMinus, FiPlus, FiTag } from "react-icons/fi";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function CartPage() {
  const { items, removeFromCart, updateQty, total, count } = useCart();
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-dark">Shopping Cart</h2>
          {count > 0 && <span className="text-sm text-gray-500">({count} {count === 1 ? "item" : "items"})</span>}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
              <FiShoppingBag size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-dark mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm">Start Shopping <FiArrowLeft className="rotate-180" /></Link>
          </div>
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-[80px_1fr_120px_140px_100px_40px] gap-4 px-4 py-3 bg-white rounded-t-lg border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Product</span>
              <span></span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span></span>
            </div>
            <div className="space-y-px bg-gray-100 rounded-b-lg overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[80px_1fr_120px_140px_100px_40px] max-md:grid-cols-[80px_1fr] max-md:gap-3 gap-4 items-center bg-white px-4 py-5">
                  <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-100" />
                  <div className="min-w-0">
                    <Link to={`/product/${item.id}`} className="text-sm font-medium text-dark hover:text-primary line-clamp-2 leading-snug">{item.name}</Link>
                  </div>
                  <div className="max-md:hidden">
                    <p className="text-sm text-gray-600">{toRWF(item.price)}</p>
                  </div>
                  <div>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-fit">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition"><FiMinus size={14} /></button>
                      <span className="px-4 py-1.5 text-sm font-medium text-dark border-x border-gray-200 min-w-[40px] text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} disabled={item.quantity && item.qty >= item.quantity} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"><FiPlus size={14} /></button>
                    </div>
                  </div>
                  <div className="max-md:hidden">
                    <p className="font-semibold text-dark text-sm">{toRWF(item.price * item.qty)}</p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-full transition" title="Remove"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-dark mb-5 pb-4 border-b border-gray-100">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark">{toRWF(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="text-gray-400">—</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-dark">Total</span>
                  <span className="font-bold text-xl text-primary">{toRWF(total)}</span>
                </div>
              </div>
              <Link to={isLoggedIn ? "/checkout" : "/login?redirect=/checkout"} className="w-full bg-primary text-white py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark mt-6 flex items-center justify-center gap-2 transition shadow-sm"><FiShoppingBag size={16} /> Proceed to Checkout</Link>
              <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-primary mt-4 flex items-center justify-center gap-1.5 transition"><FiArrowLeft size={14} /> Continue Shopping</Link>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
