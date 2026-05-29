import { FiX, FiShoppingCart, FiHeart, FiRefreshCw, FiStar } from "react-icons/fi";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { toggle: toggleWish, inWishlist } = useWishlist();
  const { toggle: toggleCompare, inCompare } = useCompare();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white transition">
          <FiX size={18} />
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-b from-gray-50 to-white p-6 flex items-center justify-center min-h-[250px]">
            <img src={product.image} alt={product.name} className="max-w-full max-h-[300px] object-contain" />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
            <h2 className="text-lg font-bold text-dark leading-snug mb-2">{product.name}</h2>
            <div className="flex items-center gap-1 text-amber-400 text-sm mb-3">
              {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} size={14} fill={i < product.rating ? "currentColor" : "none"} />)}
              <span className="text-gray-400 text-xs ml-1">({product.reviews || 0})</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">{toRWF(product.price)}</span>
              {product.oldPrice && <span className="text-sm text-gray-400 line-through">{toRWF(product.oldPrice)}</span>}
            </div>
            {product.colors?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Colors</p>
                <div className="flex gap-1.5">
                  {product.colors.slice(0, 8).map(c => (
                    <span key={c} className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm border border-gray-200" style={{ background: c.startsWith("#") ? c : `#${c}` }} />
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Sizes</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.slice(0, 8).map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{product.description}</p>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => { addToCart(product); onClose(); }} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 shadow-sm">
                <FiShoppingCart size={15} /> Add to Cart
              </button>
              <button onClick={() => toggleWish(product)} className={`w-10 h-10 rounded-xl border transition flex items-center justify-center ${inWishlist(product.id) ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"}`}>
                <FiHeart size={16} />
              </button>
              <button onClick={() => toggleCompare(product)} className={`w-10 h-10 rounded-xl border transition flex items-center justify-center ${inCompare(product.id) ? "bg-blue-50 border-blue-200 text-blue-500" : "border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-200"}`}>
                <FiRefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
