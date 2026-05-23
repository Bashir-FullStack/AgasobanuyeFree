import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const FilePlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const navItems = [
  {
    label: "Dashboard", icon: <GridIcon />, path: "/",
  },
  {
    label: "Products", icon: <CartIcon />,
    children: [
      { path: "/products/new", label: "Add Product" },
      { path: "/products", label: "Product List" },
      { path: "/products/detail", label: "Product Detail" },
    ],
  },
  {
    label: "Categories", icon: <LayersIcon />,
    children: [
      { path: "/categories/new", label: "New Category" },
      { path: "/categories", label: "Category List" },
    ],
  },
  {
    label: "Brands", icon: <LayersIcon />,
    children: [
      { path: "/brands", label: "Brand List" },
    ],
  },
  {
    label: "Coupons", icon: <FilePlusIcon />,
    children: [
      { path: "/coupons", label: "All Coupons" },
    ],
  },
  {
    label: "Delivery", icon: <TruckIcon />,
    children: [
      { path: "/delivery", label: "Delivery Locations" },
    ],
  },
  {
    label: "Banners", icon: <ImageIcon />,
    children: [
      { path: "/banners/new", label: "Add Banner" },
      { path: "/banners", label: "All Banners" },
    ],
  },
  {
    label: "Orders", icon: <FilePlusIcon />,
    children: [
      { path: "/orders", label: "Order List" },
      { path: "/orders/detail", label: "Order Detail" },
      { path: "/orders/tracking", label: "Order Tracking" },
    ],
  },
  {
    label: "Messages", icon: <MessageIcon />,
    children: [
      { path: "/messages/inbox", label: "Inbox" },
      { path: "/messages", label: "All Messages" },
    ],
  },
  {
    label: "Notifications", icon: <BellIcon />,
    children: [
      { path: "/notifications", label: "All Notifications" },
    ],
  },
  {
    label: "Customers", icon: <UsersIcon />,
    children: [
      { path: "/customers", label: "Customer List" },
      { path: "/customers/reports", label: "Reports" },
    ],
  },
  {
    label: "Subscribers", icon: <UsersIcon />,
    children: [
      { path: "/subscribers", label: "Email Subscribers" },
    ],
  },
  {
    label: "Announcements", icon: <BellIcon />,
    children: [
      { path: "/announcements", label: "All Announcements" },
    ],
  },
  {
    label: "Analytics", icon: <TrendingIcon />,
    children: [
      { path: "/analytics", label: "Overview" },
      { path: "/analytics/sales", label: "Sales Reports" },
    ],
  },
  {
    label: "Web Settings", icon: <GlobeIcon />,
    children: [
      { path: "/settings/websettings/branding", label: "Branding" },
      { path: "/settings/websettings/general", label: "General" },
    ],
  },
  {
    label: "Settings", icon: <SettingsIcon />,
    children: [
      { path: "/settings/profile", label: "Profile" },
    ],
  },
];

function MenuItem({ item, isOpen, onToggle, activePath, onNav }) {
  const isActive = item.children ? item.children.some((c) => c.path === activePath) : item.path === activePath;

  if (!item.children) {
    return (
      <li>
        <Link
          to={item.path}
          onClick={() => onNav()}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
            isActive
              ? "bg-[#2275fc]/10 text-[#2275fc] shadow-sm"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)]"
          }`}
        >
          <span className="w-5 h-5 flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
          isActive
            ? "bg-[#2275fc]/10 text-[#2275fc]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)]"
        }`}
      >
        <span className="w-5 h-5 flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
          {item.icon}
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronIcon open={isOpen} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
        <div className="ml-9 pl-3 border-l-2 border-[var(--border-color)] space-y-0.5">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={() => onNav()}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                activePath === child.path
                  ? "text-[#2275fc] font-semibold bg-[#2275fc]/5"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-page)]"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${activePath === child.path ? "bg-[#2275fc]" : "bg-[var(--text-muted)]"}`} />
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </li>
  );
}

import { API } from "../config";

export default function Layout({ children }) {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem("admin_sidebar_open");
    return saved ? { [saved]: true } : {};
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifData, setNotifData] = useState({ notifications: [], unreadCount: 0, badge: { orders: 0, messages: 0 } });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("hiromart-dark") === "true");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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

  useEffect(() => {
    const fetchNotifs = () => {
      if (!token) return;
      fetch(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setNotifData(d))
        .catch(() => {});
    };
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 15000);
    return () => clearInterval(iv);
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("hiromart-dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => {
      if (prev[label]) {
        localStorage.removeItem("admin_sidebar_open");
        return {};
      }
      localStorage.setItem("admin_sidebar_open", label);
      return { [label]: true };
    });
  };

  useEffect(() => {
    const active = navItems.find(item =>
      item.children?.some(c => c.path === location.pathname)
    );
    if (active && !localStorage.getItem("admin_sidebar_open")) {
      setOpenMenus({ [active.label]: true });
      localStorage.setItem("admin_sidebar_open", active.label);
    }
  }, [location.pathname]);

  const grouped = navItems.reduce((acc, item) => {
    const h = item.heading || "Menu";
    if (!acc[h]) acc[h] = [];
    acc[h].push(item);
    return acc;
  }, {});

  return (
    <div className="layout-wrap flex min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Sidebar */}
      <div className={`section-menu-left fixed left-0 top-0 z-30 h-full w-[280px] min-w-[280px] transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 flex flex-col`} style={{ backgroundColor: "var(--bg-sidebar)", boxShadow: "var(--shadow)" }}>
        {/* Logo area with gradient accent */}
        <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#2275fc]/20">
                H
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>hiromart</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Admin Panel</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-1">
          {Object.entries(grouped).map(([heading, items]) => (
            <div key={heading}>
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{heading}</div>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <MenuItem
                    key={item.label}
                    item={item}
                    isOpen={openMenus[item.label]}
                    onToggle={() => toggleMenu(item.label)}
                    activePath={location.pathname}
                    onNav={() => setSidebarOpen(false)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar bottom branding */}
        <div className="flex-shrink-0 px-4 py-3 text-center border-t" style={{ borderColor: "var(--border-color)" }}>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Hiromart v2.0</p>
        </div>
      </div>

      {/* Right content area */}
      <div className="section-content-right flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="header-dashboard fixed top-0 right-0 z-20 h-16 lg:h-[72px] flex items-center px-4 lg:px-6 transition-all duration-300" style={{ width: "calc(100% - 280px)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 lg:gap-4 flex-1">
              {/* Mobile hamburger */}
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              {/* Mobile logo */}
              <Link to="/" className="lg:hidden">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white font-bold text-xs">H</div>
              </Link>
              {/* Search */}
              <div className="hidden lg:block relative flex-1 max-w-md">
                <div className="flex items-center" style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: "12px" }}>
                  <svg className="ml-4 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search..."
                    onFocus={() => setSearchOpen(true)}
                    className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[var(--text-muted)]"
                    style={{ color: "var(--text-primary)" }}
                  />
                  <kbd className="mr-3 px-2 py-0.5 text-[10px] font-medium rounded-md shrink-0" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-muted)" }}>⌘K</kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                )}
              </button>

              {/* Messages */}
              <button
                onClick={() => { navigate("/messages/inbox"); setProfileOpen(false); setNotifOpen(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}
              >
                {notifData.badge.messages > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-[#FF5200] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {notifData.badge.messages}
                  </span>
                )}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
                  style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)" }}
                >
                  {notifData.unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-[#FF5200] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {notifData.unreadCount > 9 ? "9+" : notifData.unreadCount}
                    </span>
                  )}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-[360px] rounded-2xl shadow-2xl z-20 overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                      <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <div className="flex items-center gap-2">
                          <h6 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Notifications</h6>
                          {notifData.unreadCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2275fc] text-white font-semibold">{notifData.unreadCount} new</span>
                          )}
                        </div>
                        <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg hover:bg-[var(--bg-page)] transition" style={{ color: "var(--text-muted)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
                        {notifData.badge.orders > 0 && (
                          <div onClick={() => { navigate("/orders"); setNotifOpen(false); }} className="flex items-start gap-3 p-4 hover:bg-[var(--bg-page)] transition cursor-pointer" style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-lg shrink-0">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{notifData.badge.orders} pending order{notifData.badge.orders > 1 ? "s" : ""}</p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Orders awaiting processing</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        )}
                        {notifData.badge.messages > 0 && (
                          <div onClick={() => { navigate("/messages"); setNotifOpen(false); }} className="flex items-start gap-3 p-4 hover:bg-[var(--bg-page)] transition cursor-pointer" style={{ borderBottom: notifData.notifications.length > 0 ? "1px solid var(--border-color)" : "none" }}>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-lg shrink-0">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2275fc" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{notifData.badge.messages} unread message{notifData.badge.messages > 1 ? "s" : ""}</p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>From contact form</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        )}
                        {notifData.notifications.map((n, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 hover:bg-[var(--bg-page)] transition cursor-pointer" style={{ borderBottom: i < notifData.notifications.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--bg-page)" }}>{n.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{n.title}</p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{n.desc}</p>
                            </div>
                            <span className="text-[10px] shrink-0" style={{ color: "var(--text-muted)" }}>{n.time}</span>
                          </div>
                        ))}
                        {notifData.notifications.length === 0 && notifData.badge.orders === 0 && notifData.badge.messages === 0 && (
                          <div className="p-8 text-center">
                            <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>All clear, no notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 text-center border-t" style={{ borderColor: "var(--border-color)" }}>
                        <button onClick={() => { navigate("/notifications"); setNotifOpen(false); }} className="text-xs font-semibold text-[#2275fc] hover:underline">View all notifications</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all hover:bg-[var(--bg-page)] active:scale-95"
                  style={{ border: "1px solid transparent", borderColor: profileOpen ? "var(--border-color)" : "transparent" }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-semibold max-w-[100px] truncate" style={{ color: "var(--text-primary)" }}>
                    {user?.name || "Admin"}
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
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2275fc] to-[#60A5FA] flex items-center justify-center text-white text-lg font-bold mx-auto mb-2">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                        )}
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{user?.name || "Admin"}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{user?.email || "admin@hiromart.com"}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={() => { setProfileOpen(false); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-[var(--bg-page)]" style={{ color: "var(--text-secondary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          Dashboard
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate("/settings/profile"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-[var(--bg-page)]" style={{ color: "var(--text-secondary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          My Profile
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate("/settings/websettings/branding"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-[var(--bg-page)]" style={{ color: "var(--text-secondary)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                          Settings
                        </button>
                        <hr className="my-1.5" style={{ borderColor: "var(--border-color)" }} />
                        <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500">
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
        <div className="main-content min-h-screen pt-16 lg:pt-[72px] transition-all duration-300" style={{ paddingLeft: "280px", backgroundColor: "var(--bg-page)" }}>
          <div className="main-content-inner p-4 lg:p-6 flex-grow">
            <div className="main-content-wrap w-full max-w-[1700px] mx-auto">
              {children}
            </div>
          </div>
          <div className="bottom-page flex items-center justify-center gap-2 px-6 py-4 text-xs border-t" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border-color)" }}>
            <span>&copy; {new Date().getFullYear()} hiromart. All rights reserved.</span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
            <span>Made with ❤️ in Rwanda</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
