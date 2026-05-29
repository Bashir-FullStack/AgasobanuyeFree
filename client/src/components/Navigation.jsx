import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/genres", label: "Genres" },
    { to: "/favorites", label: "My List" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="hidden lg:block bg-dark border-b border-gray-800">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="flex items-center gap-1">
          {links.map(link => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? "text-[#f5c518] border-[#f5c518]"
                    : "text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
