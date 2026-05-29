import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiSliders, FiSearch, FiShoppingCart, FiHeart, FiRefreshCw } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useFetch } from "../utils/api";
import ProductTableRow from "../components/ProductTableRow";
import { ProductGridSkeleton } from "../components/Skeletons";
import SEO from "../components/SEO";
import { toRWF } from "../utils/currency";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

const fallbackBrands = ["Cartify", "EcomZone", "EcoShop", "MegaMart", "QuickCart", "SmartShop", "StyleHub"];
const colors = [
  { name: "Black", hex: "#000000" }, { name: "Blue", hex: "#0000FF" }, { name: "Red", hex: "#FF0000" },
  { name: "White", hex: "#FFFFFF" }, { name: "Green", hex: "#008000" }, { name: "Gray", hex: "#808080" },
  { name: "Gold", hex: "#FFD700" }, { name: "Purple", hex: "#800080" },
];
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "name-asc", label: "Name, A to Z" },
  { value: "name-desc", label: "Name, Z to A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCat = searchParams.get("category") || "";
  const [gridCols, setGridCols] = useState(4);
  const [sortBy, setSortBy] = useState(urlSearch ? "relevance" : "relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedCats, setExpandedCats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);

  let endpoint = "/products";
  const params = [];
  if (urlSearch) params.push(`search=${encodeURIComponent(urlSearch)}`);
  if (urlCat) params.push(`category=${encodeURIComponent(urlCat)}`);
  if (sortBy !== "relevance") params.push(`sort=${sortBy}`);
  if (minPrice > 0) params.push(`minPrice=${minPrice}`);
  if (maxPrice < 1000) params.push(`maxPrice=${maxPrice}`);
  if (selectedRating) params.push(`minRating=${selectedRating}`);
  if (selectedBrands.length > 0) params.push(`brand=${selectedBrands.join(",")}`);
  params.push(`page=${page}`);
  params.push(`limit=20`);
  if (params.length) endpoint += "?" + params.join("&");

  const { data: productsRes, loading } = useFetch(endpoint, [urlSearch, urlCat, sortBy, minPrice, maxPrice, selectedRating, selectedBrands.join(","), page]);
  const { data: categoriesData } = useFetch("/categories");
  const { data: brandsData } = useFetch("/brands");
  const productsData = productsRes?.products || productsRes || [];
  const allProducts = Array.isArray(productsData) ? productsData : [];
  const totalCount = productsRes?.total || allProducts.length;
  const totalPages = productsRes?.totalPages || Math.ceil(allProducts.length / 20);
  const categoriesList = (categoriesData || []).map(c => ({
    name: c.name,
    count: c.count || 0,
    children: [],
  }));

  useEffect(() => { setPage(1); }, [urlSearch, sortBy, minPrice, maxPrice, selectedRating, selectedBrands.join(",")]);

  const perPage = 20;
  const paginated = allProducts;

  const toggleCat = (name) => setExpandedCats((prev) => prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]);
  const filteredCats = categoriesList.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()));

  const Sidebar = () => (
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
          <div className="space-y-0.5 max-h-[260px] overflow-y-auto scrollbar-hide">
            <Link to="/categories" className="block text-sm font-medium text-primary py-1.5 px-2 rounded hover:bg-gray-50">All Categories</Link>
            {filteredCats.map((cat) => (
              <div key={cat.name}>
                <button onClick={() => toggleCat(cat.name)} className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-primary py-1.5 px-2 rounded hover:bg-gray-50">
                  <span className="truncate">{cat.name} <span className="text-gray-400 text-xs">({cat.count})</span></span>
                  {cat.children && (expandedCats.includes(cat.name) ? <FiChevronUp size={14} className="shrink-0" /> : <FiChevronDown size={14} className="shrink-0" />)}
                </button>
                {expandedCats.includes(cat.name) && cat.children && (
                  <div className="ml-4 space-y-0.5 pb-1">
                    {cat.children.map((child) => <a key={child} href="#" className="block text-xs text-gray-500 hover:text-primary py-1 px-2 rounded hover:bg-gray-50">{child}</a>)}
                  </div>
                )}
              </div>
            ))}
            {filteredCats.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No categories found</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-dark text-sm">Filter By</h3>
          <button onClick={() => { setMinPrice(0); setMaxPrice(1000); setSelectedRating(null); setSelectedBrands([]); }} className="text-xs text-primary hover:underline">Clear all</button>
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
            <div className="space-y-1.5 max-h-40 overflow-y-auto">{(brandsData && brandsData.length > 0 ? brandsData.map(b => b.name) : fallbackBrands).map((b) => <label key={b} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" className="rounded border-gray-300" checked={selectedBrands.includes(b)} onChange={() => { setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]); setPage(1); }} /><span>{b}</span></label>)}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const shopTitle = urlSearch ? `Search: ${urlSearch}` : "Shop All Products";
  const shopDesc = urlSearch
    ? `Search results for "${urlSearch}" on hiromart

. Find the best products in Rwanda.`
    : "Browse our full catalog of products available on hiromart. Shop fashion, electronics, accessories and more with fast delivery across Kigali.";

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title={shopTitle}
        description={shopDesc}
        keywords={`${urlSearch ? `${urlSearch}, ` : ""}shop online Rwanda, buy products Kigali, hiromart

, ecommerce Rwanda`}
      />
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1430px] mx-auto px-4 py-4">
          <nav className="text-xs text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-gray-700 font-medium">{urlSearch ? "Search" : "Shop"}</span>
          </nav>
          <h1 className="text-xl font-bold text-dark mt-1">{urlSearch ? `Search results for "${urlSearch}"` : "Shop"}</h1>
          {urlSearch && !loading && filtered.length === 0 && <p className="text-sm text-gray-500 mt-1">No products found. Try different keywords.</p>}
        </div>
      </div>

      <div className="max-w-[1430px] mx-auto px-4 py-6">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-[270px] shrink-0">
            <Sidebar />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary"><FiSliders size={16} /> Filter</button>
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                    {[5, 4, 3, 2].map((n) => (
                      <button key={n} onClick={() => setGridCols(n)} className={`p-1.5 rounded ${gridCols === n ? "bg-primary text-white" : "text-gray-500 hover:text-primary"}`}>
                        {n === 5 ? <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /></div> :
                         n === 4 ? <div className="flex gap-0.5"><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /><div className="w-1.5 h-3 bg-current rounded-sm" /></div> :
                         n === 3 ? <FiGrid size={16} /> : <FiList size={16} />}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{loading ? "..." : `${totalCount} product${totalCount !== 1 ? "s" : ""}`}</span>
                </div>
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary">
                    Sort: {sortOptions.find((o) => o.value === sortBy)?.label} <FiChevronDown size={14} />
                  </button>
                  {sortOpen && <div className="absolute top-full right-0 mt-1 bg-white shadow-xl border border-gray-100 rounded-lg z-30 py-1 w-48" onMouseLeave={() => setSortOpen(false)}>{sortOptions.map((o) => <button key={o.value} onClick={() => { setSortBy(o.value); setSortOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm ${sortBy === o.value ? "text-primary font-medium" : "text-gray-600 hover:text-primary hover:bg-gray-50"}`}>{o.label}</button>)}</div>}
                </div>
              </div>
            </div>

            {loading ? <ProductGridSkeleton count={perPage} /> : (
              gridCols === 2 ? (
                <div className="space-y-3">
                  {paginated.map((p) => <ShopListItem key={p.id} product={p} />)}
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
              )
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
                      const end = Math.min(totalPages, start + 6);
                      p = Math.min(start + i, end);
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

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto"><div className="flex justify-between items-center mb-4"><span className="font-bold text-dark">Filters</span><button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-primary text-lg">✕</button></div><Sidebar /></div>
        </div>
      )}
    </div>
  );
}

function ShopListItem({ product }) {
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
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
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
