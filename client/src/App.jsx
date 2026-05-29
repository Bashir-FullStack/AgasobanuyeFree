import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { API } from "./config";
import SEO from "./components/SEO";
import { TranslationProvider } from "./i18n/TranslationContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OTPVerifyPage from "./pages/OTPVerifyPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import ComparePage from "./pages/ComparePage";
import ShopPage from "./pages/ShopPage";
import CheckoutPage from "./pages/CheckoutPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import SecurePaymentPage from "./pages/SecurePaymentPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import DiscountPage from "./pages/DiscountPage";
import CreditSlipPage from "./pages/CreditSlipPage";
import SitemapPage from "./pages/SitemapPage";
import StoresPage from "./pages/StoresPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import PricesDropPage from "./pages/PricesDropPage";
import NewProductsPage from "./pages/NewProductsPage";
import BestSellersPage from "./pages/BestSellersPage";
import NotFoundPage from "./pages/NotFoundPage";

/* ── Icons ── */
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const MovieIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/>
  </svg>
);
const SportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const CommunityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const NewsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const sidebarLinks = [
  { to: "/", icon: <HomeIcon />, label: "Home" },
  { to: "/shop", icon: <MovieIcon />, label: "Movies" },
  { to: "/shop", icon: <SportIcon />, label: "Live Sports" },
  { to: "/cart", icon: <DownloadIcon />, label: "Downloads" },
  { to: "/categories", icon: <CommunityIcon />, label: "Community" },
  { to: "/about", icon: <NewsIcon />, label: "News" },
  { to: "/profile", icon: <SettingsIcon />, label: "Settings" },
];

/* ── Streaming Layout ── */
function StreamingLayout({ children, seo }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${API}/settings`)
      .then(r => r.json())
      .then(data => {
        if (data?.favicon) {
          let link = document.querySelector("link[rel='icon']");
          if (link) link.href = data.favicon;
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      {seo}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-30 h-full w-[260px] min-w-[260px] transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
        style={{ backgroundColor: "var(--bg-sidebar)", boxShadow: "var(--shadow)", borderRight: "1px solid var(--border-color)" }}>
        <div className="flex-shrink-0 px-5 py-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5c518] to-[#d4a800] flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-[#f5c518]/20">
                H
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>hiromart

</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-[#f5c518]">Streaming</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Browse</div>
          {sidebarLinks.map((link) => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#f5c518]/10 text-[#f5c518]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center shrink-0">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex-shrink-0 px-4 py-4 text-center border-t" style={{ borderColor: "var(--border-color)" }}>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>hiromart

 Streaming v1.0</p>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navbar */}
        <div className="fixed top-0 right-0 z-20 h-16 lg:h-[72px] flex items-center px-4 lg:px-6 transition-all duration-300"
          style={{ width: "calc(100% - 260px)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)", borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 lg:gap-4 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
                <MenuIcon />
              </button>
              <Link to="/" className="lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#d4a800] flex items-center justify-center text-black font-bold text-xs">H</div>
              </Link>
              <div className="hidden lg:block relative flex-1 max-w-md">
                <form onSubmit={handleSearch} className="flex items-center" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                  <SearchIcon />
                  <button type="submit" className="ml-4 shrink-0 cursor-pointer" style={{ color: "var(--text-muted)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search movies, shows, sports..."
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--text-muted)]"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <input type="submit" hidden />
                  <span className="mr-3 px-2 py-0.5 text-[10px] font-medium rounded-md shrink-0" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-muted)" }}>⌘K</span>
                </form>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <Link to="/wishlist" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </Link>

              <Link to="/cart" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative" style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}>
                <BagIcon />
              </Link>

              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}
              >
                <BellIcon />
                <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-[#f5c518] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all hover:bg-[var(--bg-page)] active:scale-95"
                  style={{ border: "1px solid transparent", borderColor: profileOpen ? "var(--border-color)" : "transparent" }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518] to-[#d4a800] flex items-center justify-center text-black text-xs font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "H"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-semibold max-w-[100px] truncate" style={{ color: "var(--text-primary)" }}>
                    {user?.name || "Guest"}
                  </span>
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-[240px] rounded-2xl shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                      <div className="p-4 text-center" style={{ borderBottom: "1px solid var(--border-color)" }}>
                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-2" />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5c518] to-[#d4a800] flex items-center justify-center text-black text-lg font-bold mx-auto mb-2">
                            {user?.name?.charAt(0)?.toUpperCase() || "H"}
                          </div>
                        )}
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{user?.name || "Guest"}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{user?.email || "guest@hiromart.com"}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={() => { setProfileOpen(false); navigate("/profile"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-[var(--bg-page)]" style={{ color: "var(--text-secondary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          My Profile
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate("/orders"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-[var(--bg-page)]" style={{ color: "var(--text-secondary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          My Orders
                        </button>
                        <hr className="my-1.5" style={{ borderColor: "var(--border-color)" }} />
                        <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-red-900/10 text-red-500">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content min-h-screen pt-16 lg:pt-[72px] transition-all duration-300" style={{ paddingLeft: "260px", backgroundColor: "var(--bg-page)" }}>
          <div className="main-content-inner p-4 lg:p-6">
            <div className="main-content-wrap w-full max-w-[1700px] mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

/* ── Homepage (Streaming Dashboard) ── */
function HomePage() {
  const featured = {
    title: "hiromart STREAMING",
    subtitle: "Premium Entertainment",
    description: "Experience the ultimate streaming platform with thousands of movies, live sports, and exclusive content. Your entertainment, your way.",
    backdrop: "https://res.cloudinary.com/dkmdeqbof/image/upload/v1779451345/Gemini_Generated_Image_ekvkvnekvkvnekvk_znyrps.png",
  };

  const categories = [
    { title: "Trending Now", color: "#f5c518" },
    { title: "Continue Watching", color: "#a855f7" },
    { title: "African Cinema", color: "#3b82f6" },
    { title: "Recommended For You", color: "#06b6d4" },
    { title: "Action Movies", color: "#ec4899" },
    { title: "Emotional Stories", color: "#22c55e" },
  ];

  const movies = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: `Movie ${i + 1}`,
    image: `https://picsum.photos/seed/movie${i}/300/170`,
    rating: (4 + Math.random()).toFixed(1),
    year: 2024 - (i % 5),
    quality: i % 3 === 0 ? "4K" : i % 3 === 1 ? "HD" : "Full HD",
  }));

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden min-h-[300px] lg:min-h-[420px] group"
        style={{ background: `url(${featured.backdrop}) center/cover` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="relative z-10 p-6 lg:p-12 max-w-2xl flex flex-col justify-end min-h-[300px] lg:min-h-[420px]">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#f5c518] text-black w-fit mb-3">
            {featured.subtitle}
          </span>
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold mb-3 leading-tight" style={{ color: "var(--text-primary)" }}>
            {featured.title}
          </h1>
          <p className="text-sm lg:text-base mb-6 max-w-lg" style={{ color: "var(--text-secondary)" }}>
            {featured.description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#f5c518] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#d4a800] transition-all shadow-lg shadow-[#f5c518]/25 group-hover:shadow-[#f5c518]/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Watch Now
            </Link>
            <button className="inline-flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[var(--bg-hover)] transition-all" style={{ color: "var(--text-primary)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Add to List
            </button>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      {categories.map((cat, ci) => (
        <div key={ci} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.title}
            </h2>
            <Link to="/shop" className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: cat.color }}>
              View All <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {movies.slice(0, 8).map((movie) => (
              <Link key={movie.id} to="/shop" className="group/card flex-shrink-0 w-[180px] lg:w-[200px] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={movie.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/fallback${movie.id}/300/170`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#f5c518] text-black font-bold">{movie.quality}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#f5c518] font-semibold">★ {movie.rating}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{movie.year}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Live Sports Section */}
      <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <span className="w-1.5 h-5 rounded-full bg-red-500 animate-pulse" />
            Live Sports
          </h2>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/20 text-red-500 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { team1: "Rwanda", team2: "Kenya", score: "2 - 1", time: "67'" },
            { team1: "APR FC", team2: "Rayon Sport", score: "0 - 0", time: "23'" },
            { team1: "Egypt", team2: "Senegal", score: "1 - 0", time: "HT" },
            { team1: "Morocco", team2: "Nigeria", score: "0 - 2", time: "52'" },
          ].map((match, i) => (
            <div key={i} className="rounded-xl p-4 transition-all hover:-translate-y-0.5" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#f5c518]">{match.time}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-500 font-bold">LIVE</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{match.team1}</span>
                  <span className="text-sm font-bold text-[#f5c518]">{match.score.split(" - ")[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{match.team2}</span>
                  <span className="text-sm font-bold text-[#f5c518]">{match.score.split(" - ")[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="rounded-2xl p-5 lg:p-6" style={{ backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <span className="w-1.5 h-5 rounded-full bg-[#a855f7]" />
          Community Activity
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {[
            { user: "Jean", action: "watched", movie: "Coming 2 America", time: "2 min ago", avatar: "J" },
            { user: "Alice", action: "rated", movie: "The Woman King", time: "5 min ago", avatar: "A" },
            { user: "Patrick", action: "added", movie: "Black Panther 2", time: "8 min ago", avatar: "P" },
            { user: "Diane", action: "reviewed", movie: "Creed III", time: "12 min ago", avatar: "D" },
          ].map((a, i) => (
            <div key={i} className="flex-shrink-0 w-[240px] rounded-xl p-4 transition-all hover:-translate-y-0.5" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border-color)" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5c518] to-[#a855f7] flex items-center justify-center text-black text-xs font-bold">{a.avatar}</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{a.user}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.time}</p>
                </div>
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{a.user}</span> {a.action} <span className="text-[#f5c518]">{a.movie}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StripeWrapper({ children }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const envKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (envKey) return setStripePromise(loadStripe(envKey));

    fetch(`${API}/payment/config`)
      .then(r => r.json())
      .then(data => {
        if (data.publishableKey) setStripePromise(loadStripe(data.publishableKey));
      })
      .catch(() => {});
  }, []);

  if (!stripePromise) return children;
  return <Elements stripe={stripePromise}>{children}</Elements>;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "652032330761-m1bcrab25iev63dr42mjmd657sclsjt8.apps.googleusercontent.com"}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TranslationProvider>
      <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <CompareProvider>
        <Routes>
          <Route path="/" element={<StreamingLayout seo={<SEO title="Home - hiromart

 Streaming" description="Ultimate African streaming experience - movies, live sports, and exclusive content" keywords="streaming, movies, live sports, African cinema" />}><HomePage /></StreamingLayout>} />
          <Route path="/login" element={<StreamingLayout seo={<SEO title="Login - hiromart

 Streaming" />}><LoginPage /></StreamingLayout>} />
          <Route path="/signup" element={<StreamingLayout seo={<SEO title="Create Account - hiromart

 Streaming" />}><SignupPage /></StreamingLayout>} />
          <Route path="/forgot-password" element={<StreamingLayout seo={<SEO title="Forgot Password" />}><ForgotPasswordPage /></StreamingLayout>} />
          <Route path="/verify-otp" element={<StreamingLayout seo={<SEO title="Verify OTP" />}><OTPVerifyPage /></StreamingLayout>} />
          <Route path="/reset-password/:token" element={<StreamingLayout seo={<SEO title="Reset Password" />}><ResetPasswordPage /></StreamingLayout>} />
          <Route path="/reset-password" element={<StreamingLayout seo={<SEO title="Reset Password" />}><ResetPasswordPage /></StreamingLayout>} />
          <Route path="/cart" element={<StreamingLayout seo={<SEO title="Cart - hiromart

 Streaming" />}><CartPage /></StreamingLayout>} />
          <Route path="/product/:id" element={<StreamingLayout><ProductPage /></StreamingLayout>} />
          <Route path="/wishlist" element={<StreamingLayout seo={<SEO title="My List - hiromart

 Streaming" />}><WishlistPage /></StreamingLayout>} />
          <Route path="/compare" element={<StreamingLayout seo={<SEO title="Compare" />}><ComparePage /></StreamingLayout>} />
          <Route path="/shop" element={<StreamingLayout><ShopPage /></StreamingLayout>} />
          <Route path="/checkout" element={<StreamingLayout seo={<SEO title="Checkout" />}><StripeWrapper><CheckoutPage /></StripeWrapper></StreamingLayout>} />
          <Route path="/categories" element={<StreamingLayout seo={<SEO title="Browse - hiromart

 Streaming" />}><CategoriesPage /></StreamingLayout>} />
          <Route path="/category/:name" element={<StreamingLayout><CategoryPage /></StreamingLayout>} />
          <Route path="/orders" element={<StreamingLayout seo={<SEO title="My Orders" />}><OrdersPage /></StreamingLayout>} />
          <Route path="/order-detail/:id" element={<StreamingLayout seo={<SEO title="Order Details" />}><OrderTrackingPage /></StreamingLayout>} />
          <Route path="/profile" element={<StreamingLayout seo={<SEO title="My Profile - hiromart

 Streaming" />}><ProfilePage /></StreamingLayout>} />
          <Route path="/help" element={<StreamingLayout seo={<SEO title="Help Center" />}><HelpCenterPage /></StreamingLayout>} />
          <Route path="/about" element={<StreamingLayout seo={<SEO title="About - hiromart

 Streaming" />}><AboutPage /></StreamingLayout>} />
          <Route path="/contact" element={<StreamingLayout seo={<SEO title="Contact Us" />}><ContactPage /></StreamingLayout>} />
          <Route path="/terms" element={<StreamingLayout seo={<SEO title="Terms & Conditions" />}><TermsPage /></StreamingLayout>} />
          <Route path="/secure-payment" element={<StreamingLayout seo={<SEO title="Secure Payment" />}><SecurePaymentPage /></StreamingLayout>} />
          <Route path="/order-tracking" element={<StreamingLayout seo={<SEO title="Order Tracking" />}><OrderTrackingPage /></StreamingLayout>} />
          <Route path="/discounts" element={<StreamingLayout seo={<SEO title="Discounts & Deals" />}><DiscountPage /></StreamingLayout>} />
          <Route path="/credit-slip" element={<StreamingLayout seo={<SEO title="Credit Slip" />}><CreditSlipPage /></StreamingLayout>} />
          <Route path="/sitemap" element={<StreamingLayout seo={<SEO title="Sitemap" />}><SitemapPage /></StreamingLayout>} />
          <Route path="/stores" element={<StreamingLayout seo={<SEO title="Our Stores" />}><StoresPage /></StreamingLayout>} />
          <Route path="/accessories" element={<StreamingLayout seo={<SEO title="Accessories" />}><AccessoriesPage /></StreamingLayout>} />
          <Route path="/prices-drop" element={<StreamingLayout seo={<SEO title="Price Drops" />}><PricesDropPage /></StreamingLayout>} />
          <Route path="/new-products" element={<StreamingLayout seo={<SEO title="New Releases" />}><NewProductsPage /></StreamingLayout>} />
          <Route path="/best-sellers" element={<StreamingLayout seo={<SEO title="Trending" />}><BestSellersPage /></StreamingLayout>} />
          <Route path="*" element={<StreamingLayout><NotFoundPage /></StreamingLayout>} />
        </Routes>
        </CompareProvider>
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
      </TranslationProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
