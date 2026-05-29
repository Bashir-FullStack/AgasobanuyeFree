import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiHome, FiFilm } from "react-icons/fi";
import { BsHeartFill } from "react-icons/bs";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { count: wishCount } = useWishlist();
  const { user, logout, isLoggedIn } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const profilePic = user?.avatar || user?.picture || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-gray-950"}`}>
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="flex items-center justify-between h-14 lg:h-20">
          <button className="lg:hidden text-gray-300 hover:text-[#f5c518] transition-colors p-1" onClick={() => setMobileMenuOpen(true)}><FiMenu size={22} /></button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="https://res.cloudinary.com/dkmdeqbof/image/upload/v1779343582/Gemini_Generated_Image_z0294uz0294uz029-removebg-preview_rv367t.png" alt="AgasobanuyeFree" className="h-8 lg:h-10 w-auto" />
          </Link>
          {isLoggedIn && (
            <Link to="/profile" className="lg:hidden">
              {profilePic ? (
                <img src={profilePic} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#f5c518]/30" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5c518] to-[#c49400] text-black flex items-center justify-center text-xs font-bold shadow-sm">{initial}</span>
              )}
            </Link>
          )}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex w-full border border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5c518]/30 focus-within:border-[#f5c518] transition-all shadow-sm">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search movies..." className="flex-1 px-4 py-2.5 text-sm outline-none bg-gray-800 text-gray-200 placeholder-gray-500" />
              <button type="submit" className="bg-[#f5c518] text-black px-5 text-sm font-medium hover:bg-[#e0b016] transition flex items-center gap-1.5"><FiSearch size={15} /> Search</button>
            </form>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Link to="/favorites" className="relative p-2 text-gray-400 hover:text-[#f5c518] transition rounded-lg hover:bg-gray-800"><BsHeartFill size={18} />{wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#f5c518] text-black text-[9px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">{wishCount}</span>}</Link>
            {isLoggedIn ? (
              <div className="relative ml-2 lg:ml-3">
                <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none">
                  {profilePic ? (
                    <img src={profilePic} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-[#f5c518]/40 transition-all" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5c518] to-[#c49400] text-black flex items-center justify-center text-sm font-bold shadow-sm hover:shadow-md transition-shadow">{initial}</span>
                  )}
                </button>
                {profileOpen && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-3 bg-gray-800 shadow-xl border border-gray-700 rounded-2xl py-2 w-56 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-[#f5c518] hover:bg-gray-700 transition">Profile</Link>
                    <div className="border-t border-gray-700 mt-1 pt-1">
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"><FiLogOut size={16} /> Sign Out</button>
                    </div>
                  </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-[#f5c518] transition px-3 py-1.5 rounded-lg hover:bg-gray-800"><FiUser size={16} /> Sign In</Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile bottom search bar */}
      <div className="lg:hidden px-4 pb-3">
        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`); }} className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search movies..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-800 text-gray-200 placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-[#f5c518]/30 transition" />
        </form>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 transition"><FiX size={18} /></button>
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                {profilePic ? (
                  <img src={profilePic} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f5c518]/30" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f5c518] to-[#c49400] text-black flex items-center justify-center text-lg font-bold shadow-sm">{initial}</span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            )}
            {!isLoggedIn && (
              <div className="mb-4 pb-4 border-b border-gray-700">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-[#f5c518] text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e0b016] transition shadow-sm"><FiUser size={16} /> Sign In / Register</Link>
              </div>
            )}
            <nav className="space-y-0.5">
              {[
                { to: "/", icon: FiHome, label: "Home" },
                { to: "/movies", icon: FiFilm, label: "Movies" },
                { to: "/favorites", icon: BsHeartFill, label: "My List" },
                { to: "/profile", icon: FiUser, label: "Profile" },
              ].map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:text-[#f5c518] hover:bg-gray-800 rounded-xl transition">
                  <Icon size={18} /> {label}
                </Link>
              ))}
              {isLoggedIn && (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition"><FiLogOut size={18} /> Sign Out</button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
    {/* Mobile bottom tab bar */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 lg:hidden safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around py-1">
        {[
          { to: "/", icon: FiHome, label: "Home" },
          { to: "/movies", icon: FiFilm, label: "Movies" },
          { to: "/favorites", icon: BsHeartFill, label: "My List" },
          { to: isLoggedIn ? "/profile" : "/login", icon: FiUser, label: isLoggedIn ? "Profile" : "Login" },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-0 text-[10px] text-gray-500 hover:text-[#f5c518] transition relative py-1.5 px-2">
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
