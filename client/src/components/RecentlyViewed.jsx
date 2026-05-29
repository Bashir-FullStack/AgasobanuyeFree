import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toRWF } from "../utils/currency";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hiromart

_recently_viewed");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProducts(Array.isArray(parsed) ? parsed.slice(0, 8) : []);
      }
    } catch { setProducts([]); }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-[1430px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-dark">Recently Viewed</h2>
        <Link to="/shop" className="text-sm text-primary font-semibold hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((p) => (
          <Link key={p.id || p._id} to={`/product/${p.id || p._id}`} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-3">
              <img src={p.image} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-2.5">
              <p className="text-xs text-gray-500 truncate">{p.name}</p>
              <p className="text-xs font-bold text-primary mt-0.5">{toRWF(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
