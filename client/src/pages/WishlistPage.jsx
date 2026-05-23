import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHeart, FiStar, FiX } from "react-icons/fi";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-[1430px] mx-auto px-4 text-center py-32">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center shadow-sm border border-rose-200/50">
            <FiHeart size={36} className="text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Save your favorite items by tapping the heart icon on any product.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-rose-700 hover:to-rose-600 transition shadow-lg shadow-rose-200">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-rose-400 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} {items.length === 1 ? "item" : "items"} saved</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((p) => (
            <div key={p.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="relative">
                <Link to={`/product/${p.id}`} className="block aspect-square bg-gray-50 p-4 flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain transition group-hover:scale-105 duration-300" />
                </Link>
                <button onClick={() => remove(p.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                  <FiX size={14} />
                </button>
                {p.oldPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-3">
                {p.brand && <p className="text-[11px] text-gray-400 mb-0.5">{p.brand}</p>}
                <Link to={`/product/${p.id}`} className="text-sm font-semibold text-gray-900 hover:text-rose-600 transition line-clamp-2 leading-snug block">{p.name}</Link>
                <div className="flex items-center gap-1 mt-2">
                  <span className="font-bold text-gray-900">{toRWF(p.price)}</span>
                  {p.oldPrice && <span className="text-xs text-gray-400 line-through">{toRWF(p.oldPrice)}</span>}
                </div>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} size={12} fill={i < p.rating ? "currentColor" : "none"} className={i < p.rating ? "text-amber-400" : "text-gray-200"} />)}
                  <span className="text-gray-400 ml-1 text-[11px]">({p.reviews})</span>
                </div>
                <button onClick={() => { addToCart(p); remove(p.id); }} className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs font-semibold py-2.5 rounded-lg hover:from-rose-700 hover:to-rose-600 transition shadow-sm shadow-rose-200">
                  <FiShoppingCart size={13} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
