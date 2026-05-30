import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiFilter, FiX, FiSearch } from "react-icons/fi";
import ProductTableRow from "../components/ProductTableRow";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useFetch } from "../utils/api";

const allTags = ["New", "Trending", "Popular", "Sale", "Hot"];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: allProducts, loading } = useFetch("/products");
  const { data: categoriesData } = useFetch("/categories");
  const products = Array.isArray(allProducts) ? allProducts : (allProducts?.products || []);
  const catDefs = categoriesData || [];

  const categories = catDefs.map(def => ({
    name: def.name,
    image: def.image || `https://picsum.photos/seed/${def.name.toLowerCase()}/800/500`,
    tag: "Popular",
    subs: [],
    count: products.filter(p => p.category === def.name).length,
    products: products.filter(p => p.category === def.name).slice(0, 5),
  }));

  const [activeCategory, setActiveCategory] = useState("Fashion");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [catSearch, setCatSearch] = useState("");

  const activeCat = categories.find(c => c.name === activeCategory) || categories[0] || null;
  const filteredCats = categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()));

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative h-[200px] md:h-[260px] overflow-hidden">
        <img loading="lazy" src="https://i.pinimg.com/736x/97/e8/f4/97e8f4d0e2143e88fbfe2db38476a7f3.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center">
          <div className="max-w-[1430px] mx-auto px-4 w-full">
            <div className="max-w-lg">
              <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Browse</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 leading-tight">All Categories</h1>
              <p className="text-gray-200 text-xs md:text-sm mt-2">Explore our wide range of products across fashion, furniture, electronics and more.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1430px] mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)} className={`group relative rounded-xl overflow-hidden h-[150px] text-left ${activeCategory === cat.name ? "ring-2 ring-primary" : ""}`}>
              <img loading="lazy" src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">{cat.tag}</span>
                <h3 className="text-white text-base font-bold mt-0.5">{cat.name}</h3>
                <p className="text-gray-300 text-xs mt-0.5">{cat.count} Products</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden fixed bottom-4 left-4 z-40 bg-primary text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2"><FiFilter size={16} /> Filters</button>
          {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

          <aside className={`w-72 shrink-0 ${sidebarOpen ? "fixed left-0 top-0 bottom-0 z-50 bg-white shadow-xl p-5 overflow-y-auto" : "hidden md:block"}`}>
            {sidebarOpen && <div className="flex justify-between items-center mb-5"><h3 className="font-bold text-dark">Filters</h3><button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-primary"><FiX size={20} /></button></div>}

            <div className="mb-7">
              <h4 className="font-bold text-sm text-dark mb-3 pb-2 border-b border-gray-100">Categories</h4>
              <div className="relative mb-2">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search categories..." value={catSearch} onChange={(e) => setCatSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-primary transition" />
              </div>
              <ul className="space-y-0.5 max-h-[300px] overflow-y-auto scrollbar-hide">
                {filteredCats.map((cat) => (
                  <li key={cat.name}>
                    <button onClick={() => { navigate(`/category/${cat.name.toLowerCase()}`); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${activeCategory === cat.name ? "bg-primary-light text-primary font-semibold" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}>
                      <span className="truncate">{cat.name}</span> <span className="text-xs text-gray-400 shrink-0 ml-2">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
              {filteredCats.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No categories found</p>}
            </div>

            <div className="mb-7">
              <h4 className="font-bold text-sm text-dark mb-3 pb-2 border-b border-gray-100">Subcategories</h4>
              <ul className="space-y-1">
                {activeCat?.subs?.length > 0 ? activeCat.subs.map((s) => (
                  <li key={s}>
                    <Link to={`/category/${activeCat.name.toLowerCase()}`} className="block px-3 py-1.5 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition">{s}</Link>
                  </li>
                )) : <p className="text-xs text-gray-400 text-center py-2">No subcategories</p>}
              </ul>
            </div>

            <div className="mb-7">
              <h4 className="font-bold text-sm text-dark mb-3 pb-2 border-b border-gray-100">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <button key={t} onClick={() => setSelectedTag(selectedTag === t ? null : t)} className={`text-xs px-3 py-1.5 rounded-full border transition ${selectedTag === t ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <h4 className="font-bold text-sm text-dark mb-3 pb-2 border-b border-gray-100">Price Range</h4>
              <div className="relative h-8 mb-1">
                <input type="range" min="0" max="1000" step="1" value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto accent-[#008744] top-3 z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#008744] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                <input type="range" min="0" max="1000" step="1" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto accent-[#008744] top-3 z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#008744] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full z-0"></div>
                <div className="absolute top-3 h-1 bg-[#008744] rounded-full z-10" style={{ left: `${(minPrice / 1000) * 100}%`, right: `${100 - (maxPrice / 1000) * 100}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>FRw {Math.round(minPrice).toLocaleString()}</span>
                <span>FRw {Math.round(maxPrice).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <input type="number" placeholder="$0" min="0" value={minPrice || 0} onChange={(e) => setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice - 1))} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#008744] transition" />
                <span className="text-gray-300">—</span>
                <input type="number" placeholder="$1000" min="0" value={maxPrice || 1000} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value) || 1000, minPrice + 1))} className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#008744] transition" />
              </div>
              <p className="text-[10px] text-gray-400 mb-2">Values in USD, shown as FRw</p>
              <button className="w-full text-xs font-semibold text-white bg-[#008744] py-2 rounded-lg hover:bg-[#006a36] transition">Apply Price</button>
            </div>

            <div className="mb-7">
              <h4 className="font-bold text-sm text-dark mb-3 pb-2 border-b border-gray-100">Rating</h4>
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary transition">
                    <input type="radio" name="rating" className="accent-primary" />
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < r ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </span>
                    <span className="text-gray-400 text-xs">{r === 1 ? "1 Star" : `${r} Stars`}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {categories.map((cat) => (
              <section key={cat.name} className={`mb-8 ${activeCategory !== cat.name ? "hidden" : ""}`}>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h2 className="text-lg md:text-xl font-bold text-dark">{cat.name}</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">{cat.count} Products</span>
                  </div>
                  <Link to={`/category/${cat.name.toLowerCase()}`} className="text-sm text-primary hover:text-primary-dark font-semibold flex items-center gap-1.5 transition">View All <FiArrowRight size={14} /></Link>
                </div>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <div className="-mr-[2px] -mb-[2px]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      {cat.products.map((p) => (
                        <div key={p.id} className="border-r-2 border-b-2 border-gray-200">
                          <ProductTableRow product={p} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {cat.count > cat.products.length && (
                  <div className="mt-5 text-center">
                    <Link to={`/category/${cat.name.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary-light px-5 py-2.5 rounded-lg hover:bg-primary hover:text-white transition">
                      See All {cat.count} Products <FiArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


