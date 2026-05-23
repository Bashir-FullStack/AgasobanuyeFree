import { Link } from "react-router-dom";
import { FiRefreshCw, FiShoppingCart, FiStar, FiCheck, FiMinus, FiX } from "react-icons/fi";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";

export default function ComparePage() {
  const { items, remove } = useCompare();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-[1430px] mx-auto px-4 text-center py-32">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-sm border border-blue-200/50">
            <FiRefreshCw size={36} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">Add products by tapping the compare icon and see their differences side by side.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow-lg shadow-blue-200">Browse Products</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: "Brand", val: (p) => <span className="font-medium text-gray-800">{p.brand}</span> },
    { label: "Price", val: (p) => <div><span className="font-bold text-lg text-gray-900">{toRWF(p.price)}</span>{p.oldPrice && <span className="text-gray-400 line-through text-xs ml-2">{toRWF(p.oldPrice)}</span>}</div> },
    { label: "Rating", val: (p) => <div className="flex items-center justify-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <FiStar key={i} size={14} fill={i < p.rating ? "currentColor" : "none"} className={i < p.rating ? "text-amber-400" : "text-gray-200"} />)}<span className="text-gray-400 text-xs ml-1.5">({p.reviews})</span></div> },
    { label: "Availability", val: () => <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-semibold"><FiCheck size={11} /> In Stock</span> },
    { label: "Shipping", val: () => <span className="text-gray-500 text-sm">Free Shipping</span> },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-10">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compare Products</h2>
            <p className="text-sm text-gray-500 mt-0.5">{items.length} {items.length === 1 ? "product" : "products"} selected</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-5 text-gray-400 font-semibold uppercase tracking-wider text-[11px] bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 w-36"></th>
                {items.map((p) => (
                  <th key={p.id} className="p-5 text-center bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 border-l border-l-gray-50 relative min-w-[210px]">
                    <button onClick={() => remove(p.id)} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition"><FiX size={16} /></button>
                    <div className="h-32 flex items-center justify-center mb-3 bg-gray-50/80 rounded-xl p-3 group">
                      <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain transition group-hover:scale-105 duration-300" />
                    </div>
                    <Link to={`/product/${p.id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2 block leading-snug">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((row) => (
                <tr key={row.label}>
                  <td className="p-4 font-semibold text-gray-500 bg-gray-50/30 border-b border-gray-50 text-xs uppercase tracking-wider">{row.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-center text-gray-600 border-b border-gray-50 border-l border-l-gray-50">{row.val(p)}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 bg-gray-50/30 rounded-bl-2xl"></td>
                {items.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-l-gray-50">
                    <button onClick={() => addToCart(p)} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-600 transition shadow-sm shadow-blue-200">
                      <FiShoppingCart size={14} /> Add to Cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
