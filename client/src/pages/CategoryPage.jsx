import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiGrid, FiList, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart, FiSearch, FiRefreshCw } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useFetch } from "../utils/api";
import ProductTableRow from "../components/ProductTableRow";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name);
  const capitalized = decodedName.charAt(0).toUpperCase() + decodedName.slice(1);

  const [page, setPage] = useState(1);
  const [gridCols, setGridCols] = useState(4);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [catSearch, setCatSearch] = useState("");

  const params = new URLSearchParams();
  params.set("category", capitalized);
  params.set("page", page);
  params.set("limit", "20");
  if (minPrice > 0) params.set("minPrice", minPrice);
  if (maxPrice < 1000) params.set("maxPrice", maxPrice);
  if (selectedRating) params.set("minRating", selectedRating);
  if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));

  const { data: productsRes, loading } = useFetch(`/products?${params.toString()}`, [capitalized, page, minPrice, maxPrice, selectedRating, selectedBrands.join(",")]);
  const { data: categoriesData } = useFetch("/categories");
  const { data: brandsData } = useFetch("/brands");
  const productsData = productsRes?.products || productsRes || [];
  const productList = Array.isArray(productsData) ? productsData : [];
  const totalCount = productsRes?.total || productList.length;
  const totalPages = productsRes?.totalPages || Math.ceil(productList.length / 20);
  const allCats = categoriesData || [];

  const currentCategory = allCats.find(c => c.name === capitalized);
  const categories = allCats.map(c => ({ name: c.name, count: c.count || 0 }));
  const filteredCats = categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()));

  const perPage = 20;
  const paginated = productList;

  const brands = (brandsData || []).map(b => b.name);

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1430px] mx-auto px-4 py-4">
          <nav className="text-xs text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
            <Link to="/categories" className="hover:text-primary">Categories</Link><span>/</span>
            <span className="text-gray-700 font-medium">{capitalized}</span>
          </nav>
          <h1 className="text-xl font-bold text-dark mt-1">{capitalized}</h1>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/90 to-primary/70 px-4 py-10 md:py-14">
        <div className="max-w-[1430px] mx-auto flex items-center gap-6">
          {currentCategory?.image && (
            <img src={currentCategory.image} alt={capitalized} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover shadow-lg shrink-0 border-2 border-white/20" />
          )}
          <div>
            <span className="text-white/70 font-bold text-xs uppercase tracking-[0.2em]">{capitalized}</span>
            <h2 className="text-white text-2xl md:text-3xl font-bold mt-1">{capitalized} Collection</h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">{currentCategory?.description || `Explore our curated selection of ${capitalized.toLowerCase()} products. Find the perfect items to match your style and needs.`}</p>
            <p className="text-white/60 text-xs mt-2">{totalCount} products available</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1430px] mx-auto px-4 py-6">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-[270px] shrink-0">
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-dark text-sm">Categories</h3>
                </div>
                <div className="p-4">
                  <div className="relative mb-2">
                    <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search categories..." value={catSearch} onChange={(e) => setCatSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-primary transition" />
                  </div>
                  <div className="space-y-0.5 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {filteredCats.map((cat) => (
                      <button key={cat.name} onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${cat.name === capitalized ? "bg-primary-light text-primary font-semibold" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}>
                        <span className="truncate">{cat.name}</span> <span className="text-xs text-gray-400 shrink-0 ml-2">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-dark text-sm">Filter By</h3>
                  <button onClick={() => { setMinPrice(0); setMaxPrice(1000); setSelectedRating(null); setSelectedBrands([]); setPage(1); }} className="text-xs text-primary hover:underline">Clear all</button>
                </div>
                <div className="p-4 space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price</h4>
                    <div className="relative h-8 mb-1">
                      <input type="range" min="0" max="1000" step="1" value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto accent-[#008744] top-3 z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#008744] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                      <input type="range" min="0" max="1000" step="1" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto accent-[#008744] top-3 z-30 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#008744] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white" />
                      <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full z-0"></div>
                      <div className="absolute top-3 h-1 bg-[#008744] rounded-full z-10" style={{ left: `${(minPrice / 1000) * 100}%`, right: `${100 - (maxPrice / 1000) * 100}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>FRw {Math.round(minPrice).toLocaleString()}</span>
                      <span>FRw {Math.round(maxPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="number" placeholder="$0" min="0" value={minPrice || 0} onChange={(e) => setMinPrice(Math.min(Number(e.target.value) || 0, maxPrice - 1))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-primary" />
                      <span className="text-gray-300">—</span>
                      <input type="number" placeholder="$1000" min="0" value={maxPrice || 1000} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value) || 1000, minPrice + 1))} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded outline-none focus:border-primary" />
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2">Values in USD, shown as FRw</p>
                    <button onClick={() => setPage(1)} className="w-full text-xs font-semibold text-white bg-primary py-2 rounded-lg hover:bg-primary-dark transition">Apply Price</button>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rating</h4>
                    <div className="space-y-1.5">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary transition">
                          <input type="radio" name="rating" checked={selectedRating === r} onChange={() => { setSelectedRating(selectedRating === r ? null : r); setPage(1); }} className="accent-primary" />
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

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brand</h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {brands.map((b) => (
                        <label key={b} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" checked={selectedBrands.includes(b)} onChange={() => { setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setPage(1); }} /> {b}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                    {[5, 4, 3, 2].map((n) => (
                      <button key={n} onClick={() => setGridCols(n)} className={`p-1.5 rounded ${gridCols === n ? "bg-primary text-white" : "text-gray-500 hover:text-primary"}`}>
                        {n === 5 ? <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /></div> :
                         n === 4 ? <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /></div> :
                         n === 3 ? <FiGrid size={16} /> : <FiList size={16} />}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{totalCount} products</span>
                </div>
              </div>
            </div>

            {gridCols === 2 ? (
              <div className="space-y-3">
                {paginated.map((p) => <CategoryListItem key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="-mr-[2px] -mb-[2px]">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {paginated.map((p) => (
                      <div key={p.id} className="border-r-2 border-b-2 border-gray-200">
                        <ProductTableRow product={p} showTimer={false} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <span className="text-sm text-gray-500">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalCount)} of {totalCount}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border border-gray-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronLeft size={16} /></button>
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let p;
                  if (totalPages <= 7) { p = i + 1; }
                  else {
                    const start = Math.max(1, page - 3);
                    p = Math.min(start + i, totalPages);
                  }
                  return p <= totalPages ? <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? "bg-primary text-white" : "text-gray-600 border border-gray-200 hover:border-primary"}`}>{p}</button> : null;
                })}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border border-gray-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronRight size={16} /></button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryListItem({ product }) {
  const { addToCart } = useCart();
  const { toggle: toggleWish, inWishlist } = useWishlist();
  const { toggle: toggleCompare, inCompare } = useCompare();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col sm:flex-row">
      <Link to={`/product/${product.id}`} className="sm:w-48 shrink-0 aspect-square sm:aspect-auto bg-gray-50 flex items-center justify-center p-4">
        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
      </Link>
      <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="text-sm font-semibold text-dark hover:text-primary transition line-clamp-2">{product.name}</Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <svg key={i} className={`w-3 h-3 ${i < product.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-sm">{toRWF(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-gray-400 line-through">{toRWF(product.oldPrice)}</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => addToCart(product)} className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition flex items-center gap-1.5"><FiShoppingCart size={14} /> Add to Cart</button>
            <button onClick={() => toggleWish(product)} className={`p-2 rounded-lg transition ${inWishlist(product.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}><FiHeart size={16} /></button>
            <Link to={`/product/${product.id}`} className="text-gray-400 hover:text-primary p-2 transition"><BsEye size={16} /></Link>
            <button onClick={() => toggleCompare(product)} className={`p-2 rounded-lg transition ${inCompare(product.id) ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}><FiRefreshCw size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
