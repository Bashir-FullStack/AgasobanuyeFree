import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiTrendingUp, FiHome, FiGrid, FiShoppingBag } from "react-icons/fi";
import { BsHeartFill, BsArrowRepeat } from "react-icons/bs";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";
import { getSearchHistory, addSearchHistory, clearSearchHistory } from "../utils/searchHistory";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [catOptions, setCatOptions] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { user, logout, isLoggedIn } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const profilePic = user?.avatar || user?.picture || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  let debounceTimer;
  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceTimer);
    if (val.trim().length < 2) { setSuggestions(null); setShowSuggestions(false); return; }
    debounceTimer = setTimeout(() => {
      fetch(`${API}/products/search-suggestions?q=${encodeURIComponent(val)}`)
        .then(r => r.json())
        .then(data => { setSuggestions(data); setShowSuggestions(true); })
        .catch(() => {});
    }, 200);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery);
      setSearchHistory(getSearchHistory());
      setShowSuggestions(false);
      const cat = selectedCat ? `&category=${encodeURIComponent(selectedCat)}` : "";
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}${cat}`);
    }
  };

  useEffect(() => {
    fetch(`${API}/products/popular-searches`)
      .then(r => r.json())
      .then(data => setPopularSearches(data.slice(0, 5)))
      .catch(() => {});
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCatOptions(data.map(c => c.name)))
      .catch(() => setCatOptions(["All Categories"]));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "glass shadow-lg" : "bg-white"}`}>
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between h-14 lg:h-20">
          <button className="lg:hidden text-gray-600 hover:text-primary transition-colors p-1" onClick={() => setMobileMenuOpen(true)}><FiMenu size={22} /></button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="https://res.cloudinary.com/dkmdeqbof/image/upload/v1779343582/Gemini_Generated_Image_z0294uz0294uz029-removebg-preview_rv367t.png" alt="Logo" className="h-8 lg:h-10 w-auto" />
          </Link>
          {isLoggedIn && (
            <Link to="/profile" className="lg:hidden">
              {profilePic ? (
                <img src={profilePic} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-xs font-bold shadow-sm">{initial}</span>
              )}
            </Link>
          )}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex w-full border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="bg-gray-50 text-sm px-3 py-2.5 border-r border-gray-200 outline-none text-gray-600 cursor-pointer hover:bg-gray-100 min-w-[130px]">
                <option value="">All Categories</option>
                {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" value={searchQuery} onChange={handleSearchInput} onFocus={() => { if (suggestions || popularSearches.length) setShowSuggestions(true); }} placeholder="Search product here..." className="flex-1 px-4 py-2.5 text-sm outline-none" />
              <button type="submit" className="bg-primary text-white px-5 text-sm font-medium hover:bg-primary-dark transition flex items-center gap-1.5"><FiSearch size={15} /> Search</button>
            </form>
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl border border-gray-100 rounded-2xl z-50 p-4">
                {suggestions?.products?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Products</p>
                    <div className="space-y-0.5">
                      {suggestions.products.map(p => (
                        <Link key={p.id} to={`/product/${p.id}`} onClick={() => setShowSuggestions(false)} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0"><img src={p.image} alt="" className="w-8 h-8 object-cover" /></div>
                          <span className="text-sm text-gray-700 flex-1 truncate font-medium">{p.name}</span>
                          <span className="text-xs font-semibold text-primary">FRw {Math.round(p.price).toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions?.categories?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.categories.map(c => (
                        <Link key={c} to={`/category/${c.toLowerCase()}`} onClick={() => setShowSuggestions(false)} className="text-xs px-3 py-1.5 bg-primary-lighter rounded-full text-primary font-medium hover:bg-primary hover:text-white transition">{c}</Link>
                      ))}
                    </div>
                  </div>
                )}
                {!suggestions?.products?.length && !suggestions?.categories?.length && searchHistory.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1"><FiClock size={12} /> Recent Searches</p>
                    <div className="space-y-0.5">
                      {searchHistory.slice(0, 5).map(q => (
                        <button key={q} onClick={() => { setSearchQuery(q); setShowSuggestions(false); addSearchHistory(q); navigate(`/shop?search=${encodeURIComponent(q)}`); }} className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition text-sm text-gray-600">
                          <FiSearch size={13} className="text-gray-300" /> {q}
                        </button>
                      ))}
                      <button onClick={() => { clearSearchHistory(); setSearchHistory([]); }} className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-red-500 transition mt-1">Clear history</button>
                    </div>
                  </div>
                )}
                {!suggestions?.products?.length && !suggestions?.categories?.length && popularSearches.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1"><FiTrendingUp size={12} /> Popular Searches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map(s => (
                        <button key={s.query} onClick={() => { setSearchQuery(s.query); setShowSuggestions(false); navigate(`/shop?search=${encodeURIComponent(s.query)}`); }} className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 hover:bg-primary hover:text-white transition">{s.query}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Link to="/compare" className="relative p-2 text-gray-500 hover:text-primary transition rounded-lg hover:bg-primary-lighter hidden lg:block"><BsArrowRepeat size={20} />{compareCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold min-w-[18px] h-[18px]">{compareCount}</span>}</Link>
            <Link to="/wishlist" className="relative p-2 text-gray-500 hover:text-primary transition rounded-lg hover:bg-primary-lighter"><BsHeartFill size={18} />{wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold min-w-[18px] h-[18px]">{wishCount}</span>}</Link>
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary transition rounded-lg hover:bg-primary-lighter"><FiShoppingBag size={20} />{count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold min-w-[18px] h-[18px]">{count}</span>}</Link>
            {isLoggedIn ? (
              <div className="relative ml-2 lg:ml-3">
                <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none">
                  {profilePic ? (
                    <img src={profilePic} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/40 transition-all" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-sm font-bold shadow-sm hover:shadow-md transition-shadow">{initial}</span>
                  )}
                </button>
                {profileOpen && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-3 bg-white shadow-xl border border-gray-100 rounded-2xl py-2 w-56 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-dark truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition"><FiPackage size={16} /> My Orders</Link>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition"><FiSettings size={16} /> Account Settings</Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"><FiLogOut size={16} /> Sign Out</button>
                    </div>
                  </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition px-3 py-1.5 rounded-lg hover:bg-primary-lighter"><FiUser size={16} /> Sign In</Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile bottom search bar */}
      <div className="lg:hidden px-4 pb-3">
        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); }} className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" value={searchQuery} onChange={handleSearchInput} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition" />
        </form>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6"><span className="text-lg font-bold text-dark">Menu</span><button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"><FiX size={18} /></button></div>
            {isLoggedIn && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                {profilePic ? (
                  <img src={profilePic} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-lg font-bold shadow-sm">{initial}</span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            )}
            {!isLoggedIn && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiUser size={16} /> Sign In / Register</Link>
              </div>
            )}
            <nav className="space-y-0.5">
              {[
                { to: "/", icon: FiHome, label: "Home" },
                { to: "/shop", icon: FiShoppingBag, label: "Shop" },
                { to: "/categories", icon: FiGrid, label: "Categories" },
                { to: "/orders", icon: FiPackage, label: "My Orders" },
                { to: "/wishlist", icon: BsHeartFill, label: "Wishlist" },
              ].map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-lighter rounded-xl transition">
                  <Icon size={18} /> {label}
                </Link>
              ))}
              {isLoggedIn && (
                <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-lighter rounded-xl transition"><FiUser size={18} /> My Profile</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition"><FiLogOut size={18} /> Sign Out</button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
    {/* Mobile bottom tab bar */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around py-1">
        {[
          { to: "/", icon: FiHome, label: "Home" },
          { to: "/categories", icon: FiGrid, label: "Categories" },
          { to: "/cart", icon: FiShoppingBag, label: "Cart", badge: count },
          { to: "/wishlist", icon: BsHeartFill, label: "Wishlist" },
          { to: isLoggedIn ? "/profile" : "/login", icon: FiUser, label: isLoggedIn ? "Profile" : "Login" },
        ].map(({ to, icon: Icon, label, badge }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-0 text-[10px] text-gray-500 hover:text-primary transition relative py-1.5 px-2">
            <div className="relative">
              <Icon size={20} />
              {badge > 0 && <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[8px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold leading-none">{badge > 9 ? "9+" : badge}</span>}
            </div>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
