import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiFilm, FiUsers, FiGrid, FiTag, FiMonitor, FiBookOpen, FiUserCheck, FiLogOut, FiBarChart2, FiGift, FiStar, FiMail, FiSun, FiMoon } from 'react-icons/fi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <FiBarChart2 />, end: true },
  { path: '/movies', label: 'Movies', icon: <FiFilm /> },
  { path: '/interpreters', label: 'Interpreters', icon: <FiUsers /> },
  { path: '/genres', label: 'Genres', icon: <FiGrid /> },
  { path: '/categories', label: 'Categories', icon: <FiTag /> },
  { path: '/banners', label: 'Banners', icon: <FiMonitor /> },
  { path: '/bookings', label: 'Bookings', icon: <FiBookOpen /> },
  { path: '/users', label: 'Users', icon: <FiUserCheck /> },
  { path: '/promos', label: 'Promos', icon: <FiGift /> },
  { path: '/reviews', label: 'Reviews', icon: <FiStar /> },
  { path: '/subscribers', label: 'Subscribers', icon: <FiMail /> },
];

const Layout = () => {
  const navigate = useNavigate();
  const [isLight, setIsLight] = React.useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    const theme = next ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('light', next);
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="https://i.ibb.co/sdytJ14n/Chat-GPT-Image-May-26-2026-06-12-32-AM.png" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          <h2 style={{ fontSize: 14 }}>AgasobanuyeFREE</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button className="btn btn-secondary btn-block btn-sm" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="header">
          <div className="header-title">
            <h1>Admin Panel</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-icon btn-secondary" onClick={toggleTheme} title={`Switch to ${isLight ? 'dark' : 'light'} theme`}>
              {isLight ? <FiMoon /> : <FiSun />}
            </button>
            <div className="header-user">
              <FiUserCheck className="header-user-icon" />
              <span>Admin</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
