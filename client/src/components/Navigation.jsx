import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiMenu, FiStar } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNav } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useFetch } from "../utils/api";
import API from "../utils/api";

const navOrder = ["Shop", "Categories", "Products", "TopDeals", "Elements"];

function getToken() {
  try { return localStorage.getItem("classyshop_token"); } catch { return null; }
}

export default function Navigation() {
  const navigate = useNavigate();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [catProducts, setCatProducts] = useState({});
  const [openVertSub, setOpenVertSub] = useState(null);
  const { data: categoriesData } = useFetch("/categories");
  const { data: productsData } = useFetch("/products?limit=6");
  const { data: newCollectionData } = useFetch("/products/personalized-new", [], getToken());
  const { data: dealsData } = useFetch("/products/prices-drop?limit=4");

  const categories = categoriesData || [];
  const navProducts = (productsData || []).slice(0, 6);
  const newCollection = (newCollectionData || []).slice(0, 5);
  const deals = (dealsData || []).slice(0, 4);

  const loadedRef = useRef(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (loadedRef.current || categories.length === 0) return;
    loadedRef.current = true;
    categories.slice(0, 8).forEach(async (cat) => {
      try {
        const res = await fetch(`${API}/products?category=${encodeURIComponent(cat.name)}&limit=4`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.products || []);
        if (list.length > 0) {
          setCatProducts(prev => ({ ...prev, [cat.name]: list }));
        }
      } catch {}
    });
  }, [categories]);

  const handleSubEnter = (catName) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenVertSub(catName);
  };
  const handleSubLeave = () => {
    closeTimerRef.current = setTimeout(() => setOpenVertSub(null), 300);
  };

  const dropdownPos = (name) => {
    const idx = navOrder.indexOf(name);
    if (idx <= 1) return "left-0";
    if (idx >= 3) return "right-0";
    return "left-1/2 -translate-x-1/2";
  };

  const FRw = (price) => `FRw ${Math.round(price || 0).toLocaleString()}`;

  const linkOrBlank = (p) => `/product/${p.id || p._id}`;

  return (
    <div className="hidden lg:block bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      <div className="max-w-[1430px] mx-auto px-4 flex items-stretch">
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex items-center gap-2 bg-dark text-white px-6 py-3.5 text-sm font-medium min-w-[270px] hover:bg-dark-soft transition"
          >
            <FiMenu size={18} /> Shop By Categories <FiChevronDown size={14} className={`ml-auto transition ${categoryOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`absolute top-full left-0 w-[270px] bg-white shadow-xl z-50 border border-gray-100 transition-all duration-200 ${categoryOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
            {categories.map((cat) => {
              const isHovered = openVertSub === cat.name;
              return (
                <div key={cat._id || cat.name} className="relative" onMouseEnter={() => handleSubEnter(cat.name)} onMouseLeave={handleSubLeave}>
                  <Link
                    to={`/category/${cat.name.toLowerCase()}`}
                    className="w-full flex items-center justify-between px-5 py-2.5 text-sm text-gray-700 hover:bg-primary-lighter hover:text-primary border-b border-gray-50"
                    onClick={() => setCategoryOpen(false)}
                  >
                    <span>{cat.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">({cat.count || 0})</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 transition"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </Link>
                  {isHovered && (
                    <div className="absolute left-full top-0 w-[360px] bg-white shadow-xl border border-gray-100 z-50 p-4 rounded-r-xl min-h-[200px]" onMouseEnter={() => handleSubEnter(cat.name)} onMouseLeave={handleSubLeave}>
                      {catProducts[cat.name]?.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            {catProducts[cat.name].slice(0, 4).map(p => (
                              <Link key={p.id || p._id} to={linkOrBlank(p)} className="block group" onClick={() => setCategoryOpen(false)}>
                                <div className="rounded-lg overflow-hidden bg-gray-50 h-20 mb-1"><img src={p.image || "https://picsum.photos/seed/p/150/150"} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition" /></div>
                                <p className="text-xs text-gray-600 truncate group-hover:text-primary">{p.name}</p>
                                <span className="text-xs font-bold text-primary">{FRw(p.price)}</span>
                              </Link>
                            ))}
                          </div>
                          <Link to={`/category/${cat.name.toLowerCase()}`} className="block text-center text-xs font-semibold text-primary mt-3 hover:underline" onClick={() => setCategoryOpen(false)}>View All {cat.name} →</Link>
                        </>
                      ) : (
                        <div className="flex items-center justify-center min-h-[160px]"><p className="text-xs text-gray-400">Loading products...</p></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <nav className="flex items-center ml-8 flex-1" onMouseLeave={() => setMegaMenu(null)}>
          <Link to="/" className="px-4 py-3.5 text-sm font-medium text-primary border-b-2 border-primary shrink-0">Home</Link>

          <div className="relative shrink-0" onMouseEnter={() => setMegaMenu("Shop")} onMouseLeave={() => setMegaMenu(null)}>
            <Link to="/shop" className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-primary transition whitespace-nowrap">
              Shop <FiChevronDown size={14} />
            </Link>
            {megaMenu === "Shop" && (
              <div className={`absolute top-full ${dropdownPos("Shop")} bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-6 w-[800px]`}>
                <div className="grid grid-cols-5 gap-6">
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-3">Latest Products</p>
                    <ul className="space-y-2">
                      {navProducts.map(p => (
                        <li key={p.id || p._id}><Link to={linkOrBlank(p)} className="text-sm text-gray-600 hover:text-primary truncate block">{p.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-3">Shop Pages</p>
                    <ul className="space-y-2">
                      {[["Checkout","/checkout"],["Categories","/categories"],["Cart","/cart"],["Login","/login"],["Shop All","/shop"],["My Account","/profile"]].map(([l,lnk]) => (
                        <li key={l}><Link to={lnk} className="text-sm text-gray-600 hover:text-primary">{l}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-3">Categories</p>
                    <ul className="space-y-2">
                      {categories.slice(0, 6).map(cat => (
                        <li key={cat._id || cat.name}><Link to={`/category/${cat.name.toLowerCase()}`} className="text-sm text-gray-600 hover:text-primary">{cat.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {deals.slice(0, 2).map(p => (
                      <Link key={p.id || p._id} to={linkOrBlank(p)} className="block relative rounded-xl overflow-hidden h-44 group">
                        <img src={p.image || "https://picsum.photos/seed/mbanner/300/400"} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end">
                          <span className="text-primary text-xs font-medium">Hot deal</span>
                          <h4 className="text-white font-bold text-base leading-tight mt-1">{p.name}</h4>
                          <span className="text-primary font-bold text-base mt-1">{FRw(p.price)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative shrink-0" onMouseEnter={() => setMegaMenu("Categories")} onMouseLeave={() => setMegaMenu(null)}>
            <button onClick={() => navigate("/categories")} className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-primary transition whitespace-nowrap">
              Categories <FiChevronDown size={14} />
              {categories.length > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">{categories.length}</span>}
            </button>
            {megaMenu === "Categories" && (
              <div className={`absolute top-full ${dropdownPos("Categories")} glass rounded-2xl shadow-xl z-50 p-6 w-[800px]`}>
                <div className="grid grid-cols-4 gap-6">
                  {categories.slice(0, 4).map((cat) => {
                    const cp = catProducts[cat.name] || [];
                    return (
                      <div key={cat._id || cat.name}>
                        <Link to={`/category/${cat.name.toLowerCase()}`} onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)} className="font-semibold text-sm text-dark hover:text-primary block mb-2">{cat.name}</Link>
                        {cp.length > 0 ? (
                          <div className="space-y-2">
                            {cp.slice(0, 3).map(p => (
                              <Link key={p.id || p._id} to={linkOrBlank(p)} className="flex items-center gap-2 group">
                                <img src={p.image || "https://picsum.photos/seed/nav/60/60"} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-600 truncate group-hover:text-primary">{p.name}</p>
                                  <span className="text-xs font-semibold text-primary">{FRw(p.price)}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400">{cat.count || 0} products</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center mt-4 pt-3 border-t border-gray-100">
                  <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">Browse All Categories →</Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative shrink-0" onMouseEnter={() => setMegaMenu("Products")} onMouseLeave={() => setMegaMenu(null)}>
            <button className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-primary transition whitespace-nowrap">
              Products <FiChevronDown size={14} />
              {navProducts.length > 0 && <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">{navProducts.length}</span>}
            </button>
            {megaMenu === "Products" && newCollection.length > 0 && (
              <div className={`absolute top-full ${dropdownPos("Products")} bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-6 w-[800px]`}>
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-primary-light to-gray-50 rounded-xl p-5 flex flex-col justify-center">
                    <p className="font-bold text-dark text-base">The New Collection</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">Discover our latest arrivals with fresh styles.</p>
                    <Link to="/shop" className="text-primary text-sm font-medium underline mt-3 inline-block">Shop Now</Link>
                  </div>
                  <div className="col-span-3">
                    <Swiper modules={[SwiperNav]} slidesPerView={3} spaceBetween={12} navigation className="px-1">
                      {newCollection.map((p) => (
                        <SwiperSlide key={p.id || p._id}>
                          <Link to={linkOrBlank(p)} className="block group">
                            <div className="overflow-hidden rounded-xl bg-white h-28 mb-2 border border-gray-100"><img src={p.image || "https://picsum.photos/seed/nav/200/200"} alt={p.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition" /></div>
                            <p className="text-xs text-gray-600 truncate group-hover:text-primary">{p.name}</p>
                            <span className="text-xs font-bold text-primary">{FRw(p.price)}</span>
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative shrink-0" onMouseEnter={() => setMegaMenu("TopDeals")} onMouseLeave={() => setMegaMenu(null)}>
            <button className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-primary transition whitespace-nowrap">
              Top Deals <FiChevronDown size={14} />
            </button>
            {megaMenu === "TopDeals" && (
              <div className={`absolute top-full ${dropdownPos("TopDeals")} glass rounded-2xl shadow-xl z-50 p-6 w-[800px]`}>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-4 text-center">Shop By Category</p>
                    <div className="grid grid-cols-4 gap-3">
                      {categories.slice(0, 8).map((cat, i) => (
                        <Link key={cat._id || cat.name} to={`/category/${cat.name.toLowerCase()}`} className="text-center group">
                          <div className="rounded-xl overflow-hidden h-20 mb-1 bg-gray-50"><img src={cat.image || `https://picsum.photos/seed/mcat${i+1}/150/150`} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition" /></div>
                          <span className="text-[11px] text-gray-600 group-hover:text-primary">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-4 text-center">Best Deals</p>
                    <div className="space-y-3">
                      {deals.length > 0 ? deals.map(p => (
                        <Link key={p.id || p._id} to={linkOrBlank(p)} className="flex gap-2 items-center group">
                          <img src={p.image || "https://picsum.photos/seed/nav/100/100"} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-600 truncate group-hover:text-primary">{p.name}</p>
                            <span className="text-xs font-bold text-primary">{FRw(p.price)}</span>
                          </div>
                        </Link>
                      )) : navProducts.slice(0, 4).map(p => (
                        <Link key={p.id || p._id} to={linkOrBlank(p)} className="flex gap-2 items-center group">
                          <img src={p.image || "https://picsum.photos/seed/nav/100/100"} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-600 truncate group-hover:text-primary">{p.name}</p>
                            <span className="text-xs font-bold text-primary">{FRw(p.price)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative shrink-0" onMouseEnter={() => setMegaMenu("Elements")} onMouseLeave={() => setMegaMenu(null)}>
            <button className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-primary transition whitespace-nowrap">
              Elements <FiChevronDown size={14} />
            </button>
            {megaMenu === "Elements" && (
              <div className={`absolute top-full ${dropdownPos("Elements")} bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 w-[210px]`}>
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Contact Us" },
                  { to: "/help", label: "Help Center" },
                  { to: "/sitemap", label: "Sitemap" },
                  { to: "/stores", label: "Stores" },
                  { to: "/terms", label: "Terms & Conditions" },
                  { to: "/secure-payment", label: "Secure Payment" },
                ].map(({ to, label }) => (
                  <Link key={to} to={to} className="block px-5 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-primary-lighter transition">{label}</Link>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center shrink-0">
            <Link to="/shop" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition px-3 py-1.5 rounded-lg bg-primary-lighter hover:bg-primary hover:text-white">
              <FiStar size={16} /> Deals Ending Soon!
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
