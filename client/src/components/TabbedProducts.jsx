import { useState, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFetch } from "../utils/api";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./Skeletons";

export default function TabbedProducts() {
  const { data: categoriesData } = useFetch("/categories");
  const tabs = (categoriesData || []).map(c => c.name);
  const [active, setActive] = useState("");
  const scrollRef = useRef(null);
  const activeCat = active || (tabs.length > 0 ? tabs[0] : "");
  const { data, loading } = useFetch(activeCat ? `/products?category=${activeCat}&limit=10` : null, [activeCat]);
  const products = Array.isArray(data) ? data : data?.products || [];

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 150, behavior: "smooth" });
  };

  return (
    <section className="mb-14">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-1 h-7 bg-primary rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-bold text-dark">Featured Products</h2>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => scroll(-1)} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition"><FiChevronLeft size={15} /></button>
            <div ref={scrollRef} className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth max-w-[400px]">
              {tabs.map((t) => (
                <button key={t} onClick={() => setActive(t)} className={`relative px-3 py-1.5 text-sm font-medium whitespace-nowrap rounded-lg transition ${activeCat === t ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-primary hover:bg-gray-50"}`}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={() => scroll(1)} className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition"><FiChevronRight size={15} /></button>
          </div>
        </div>
        {loading ? <ProductGridSkeleton count={5} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
