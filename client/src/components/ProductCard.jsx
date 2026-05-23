import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiRefreshCw, FiShoppingCart, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { toRWF } from "../utils/currency";
import { badgeDesign } from "../utils/badge";
import CountdownTimer from "./CountdownTimer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useState } from "react";

export default function ProductCard({ product, showTimer }) {
  const navigate = useNavigate();
  const { items, addToCart, updateQty } = useCart();
  const { toggle: toggleWish, inWishlist } = useWishlist();
  const { toggle: toggleCompare, inCompare } = useCompare();
  const cartItem = items.find(i => i.id === product.id);
  const [quickShop, setQuickShop] = useState(false);
  const [qsQty, setQsQty] = useState(1);
  const [qsSize, setQsSize] = useState(null);
  const [qsColor, setQsColor] = useState(null);

  const sizes = product.sizes?.length ? product.sizes : [];
  const colors = product.colors?.length ? product.colors : [];

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full card-hover">
      <div className="relative bg-gradient-to-b from-gray-50 to-white aspect-square flex items-center justify-center p-4 overflow-hidden">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500" />
        </Link>
        {product.badge && <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1.5 text-white flex items-center justify-center shadow-md ${badgeDesign(product.badge).color}`} style={{ clipPath: badgeDesign(product.badge).shape }}>{product.badge}</span>}
        {product.sale && <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">{product.sale}</span>}
        {product.colors?.length > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            {product.colors.slice(0, 6).map(c => (
              <span key={c} className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm" style={{ background: c.startsWith("#") ? c : `#${c}` }} title={c} />
            ))}
            {product.colors.length > 6 && <span className="text-[9px] font-bold text-gray-500 ml-0.5">+{product.colors.length - 6}</span>}
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
          <button onClick={() => toggleWish(product)} className={`bg-white shadow-lg p-2 rounded-xl transition ${inWishlist(product.id) ? "text-red-500 shadow-red-500/20" : "text-gray-500 hover:text-primary hover:shadow-primary/20"}`} title="Add to Wishlist"><FiHeart size={16} /></button>
          <button onClick={() => toggleCompare(product)} className={`bg-white shadow-lg p-2 rounded-xl transition ${inCompare(product.id) ? "text-blue-500 shadow-blue-500/20" : "text-gray-500 hover:text-primary hover:shadow-primary/20"}`} title="Add to Compare"><FiRefreshCw size={16} /></button>
          <Link to={`/product/${product.id}`} className="bg-white shadow-lg p-2 rounded-xl text-gray-500 hover:text-primary hover:shadow-primary/20 transition" title="Quick View"><BsEye size={16} /></Link>
        </div>
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 mb-1 font-medium uppercase tracking-wider">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="text-sm font-semibold text-dark hover:text-primary transition leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</Link>
        <div className="flex items-center gap-1 text-amber-400 text-xs mt-1.5">{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < product.rating ? "★" : "☆"}</span>)}<span className="text-gray-400 ml-1 text-[10px]">({product.reviews})</span></div>
        <div className="flex items-center gap-2 mt-auto pt-2.5"><span className="font-bold text-primary text-sm">{toRWF(product.price)}</span>{product.oldPrice && <span className="text-gray-400 text-xs line-through">{toRWF(product.oldPrice)}</span>}</div>
        {showTimer && product.endDate && <CountdownTimer endDate={product.endDate} />}
        {cartItem ? (
          <div className="mt-2.5 flex items-center bg-primary-lighter rounded-xl overflow-hidden border border-primary/20">
            <button onClick={() => updateQty(product.id, cartItem.qty - 1)} className="flex-1 py-2 text-primary hover:bg-primary/10 transition flex items-center justify-center"><FiMinus size={14} /></button>
            <span className="px-4 py-2 text-sm font-bold text-dark min-w-[40px] text-center bg-white/50">{cartItem.qty}</span>
            <button onClick={() => updateQty(product.id, cartItem.qty + 1)} className="flex-1 py-2 text-primary hover:bg-primary/10 transition flex items-center justify-center"><FiPlus size={14} /></button>
          </div>
        ) : (
          <div className="mt-2.5 flex gap-1.5">
            <button onClick={() => addToCart(product)} className="flex-1 bg-primary text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-1.5 shadow-sm"><FiShoppingCart size={13} /> Add</button>
            {(sizes.length > 0 || colors.length > 0) && (
              <button onClick={() => { setQuickShop(true); setQsQty(1); setQsSize(null); setQsColor(null); }} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-2.5 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-sm">Quick Shop</button>
            )}
          </div>
        )}
      </div>

      {/* Quick Shop Modal */}
      {quickShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setQuickShop(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-scale-in">
            <button onClick={() => setQuickShop(false)} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"><FiX size={16} /></button>
            <div className="flex gap-4 mb-4">
              <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0"><img src={product.image} alt={product.name} className="w-full h-full object-contain" /></div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-dark truncate">{product.name}</p>
                <p className="text-sm font-bold text-primary mt-1">{toRWF(product.price)}</p>
              </div>
            </div>
            {sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-dark mb-1.5">Size</p>
                <div className="flex gap-1.5 flex-wrap">
                  {sizes.map(s => (
                    <button key={s} onClick={() => setQsSize(s)} className={`min-w-[36px] h-8 px-2.5 rounded-lg border text-xs font-medium transition ${qsSize === s ? "border-primary bg-primary text-white shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-dark mb-1.5">Color</p>
                <div className="flex gap-1.5 flex-wrap">
                  {colors.map(c => (
                    <button key={c} onClick={() => setQsColor(c)} className={`w-7 h-7 rounded-full ring-2 transition ${qsColor === c ? "ring-primary scale-110" : "ring-gray-300"}`} style={{ background: c.startsWith("#") ? c : `#${c}` }} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQsQty(Math.max(1, qsQty - 1))} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition"><FiMinus size={14} /></button>
                <span className="px-4 py-1.5 text-sm font-semibold text-dark border-x border-gray-200 min-w-[36px] text-center">{qsQty}</span>
                <button onClick={() => setQsQty(Math.min(product.quantity || 99, qsQty + 1))} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 transition"><FiPlus size={14} /></button>
              </div>
              <button onClick={() => { addToCart(product, qsQty); setQuickShop(false); }} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
