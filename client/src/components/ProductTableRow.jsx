import { Link } from "react-router-dom";
import { FiHeart, FiRefreshCw, FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { toRWF } from "../utils/currency";
import { badgeDesign } from "../utils/badge";
import CountdownTimer from "./CountdownTimer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

export default function ProductTableRow({ product, showTimer }) {
  const { items, addToCart, updateQty } = useCart();
  const { toggle: toggleWish, inWishlist } = useWishlist();
  const { toggle: toggleCompare, inCompare } = useCompare();
  const cartItem = items.find(i => i.id === product.id);

  return (
    <div className="p-2.5 flex flex-col h-full">
      <div className="relative group/image">
        <Link to={`/product/${product.id}`} className="block h-40 bg-white flex items-center justify-center rounded-lg overflow-hidden mb-2 relative">
          {product.badge && <span className={`absolute top-2 left-2 text-[11px] font-bold px-4 py-2 text-white z-10 flex items-center justify-center ${badgeDesign(product.badge).color}`} style={{ clipPath: badgeDesign(product.badge).shape }}>{product.badge}</span>}
          <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain group-hover/image:scale-105 transition duration-500" />
          {product.colors?.length > 0 && (
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5">
              {product.colors.slice(0, 5).map(c => (
                <span key={c} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: c.startsWith("#") ? c : `#${c}` }} title={c} />
              ))}
              {product.colors.length > 5 && <span className="text-[9px] font-bold text-gray-500 ml-0.5">+{product.colors.length - 5}</span>}
            </div>
          )}
        </Link>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 group-hover/image:opacity-100 transition-opacity">
          <button onClick={() => toggleWish(product)} className={`bg-white shadow-md p-1.5 rounded-full transition ${inWishlist(product.id) ? "text-red-500" : "text-gray-500 hover:text-primary"}`} title="Wishlist"><FiHeart size={14} /></button>
          <button onClick={() => toggleCompare(product)} className={`bg-white shadow-md p-1.5 rounded-full transition ${inCompare(product.id) ? "text-blue-500" : "text-gray-500 hover:text-primary"}`} title="Compare"><FiRefreshCw size={14} /></button>
          <Link to={`/product/${product.id}`} className="bg-white shadow-md p-1.5 rounded-full text-gray-500 hover:text-primary transition" title="Quick View"><BsEye size={14} /></Link>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 truncate leading-tight">{product.brand}</p>
      <Link to={`/product/${product.id}`} className="text-sm font-semibold text-dark hover:text-primary transition line-clamp-2 leading-snug min-h-[2rem]">{product.name}</Link>
      <div className="flex items-center gap-1 text-yellow-400 text-[10px] mt-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < product.rating ? "★" : "☆"}</span>)}<span className="text-gray-400 ml-1">({product.reviews})</span></div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="font-bold text-primary text-sm">{toRWF(product.price)}</span>
        {product.oldPrice && <span className="text-gray-400 text-[10px] line-through">{toRWF(product.oldPrice)}</span>}
      </div>
      {showTimer && product.endDate && <CountdownTimer endDate={product.endDate} />}
      <div className="mt-auto pt-1.5">
        {cartItem ? (
          <div className="flex items-center border border-primary rounded-lg overflow-hidden">
            <button onClick={() => updateQty(product.id, cartItem.qty - 1)} className="flex-1 py-1.5 text-primary hover:bg-primary-light transition flex items-center justify-center"><FiMinus size={12} /></button>
            <span className="px-3 py-1.5 text-sm font-semibold text-dark border-x border-primary/30 bg-white">{cartItem.qty}</span>
            <button onClick={() => updateQty(product.id, cartItem.qty + 1)} className="flex-1 py-1.5 text-primary hover:bg-primary-light transition flex items-center justify-center"><FiPlus size={12} /></button>
          </div>
        ) : (
          <button onClick={() => addToCart(product)} className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-1.5"><FiShoppingCart size={12} /> Add to cart</button>
        )}
      </div>
    </div>
  );
}
