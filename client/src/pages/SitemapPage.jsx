import { Link } from "react-router-dom";
import { FiHome, FiGrid, FiShoppingBag, FiUser, FiHeart, FiRefreshCw, FiPackage, FiHelpCircle, FiFileText, FiShield } from "react-icons/fi";

const sections = [
  { title: "Main Pages", icon: FiHome, links: [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Categories", path: "/categories" },
    { label: "Cart", path: "/cart" },
    { label: "Checkout", path: "/checkout" },
  ]},
  { title: "Products", icon: FiGrid, links: [
    { label: "Prices Drop", path: "/prices-drop" },
    { label: "New Products", path: "/new-products" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "Accessories", path: "/accessories" },
    { label: "Discounts & Deals", path: "/discounts" },
  ]},
  { title: "Account", icon: FiUser, links: [
    { label: "My Orders", path: "/orders" },
    { label: "Profile", path: "/profile" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Compare", path: "/compare" },
    { label: "Sign In", path: "/login" },
    { label: "Create Account", path: "/signup" },
  ]},
  { title: "Services", icon: FiPackage, links: [
    { label: "Order Tracking", path: "/order-tracking" },
    { label: "Credit Slip", path: "/credit-slip" },
    { label: "Stores", path: "/stores" },
    { label: "Secure Payment", path: "/secure-payment" },
  ]},
  { title: "Support", icon: FiHelpCircle, links: [
    { label: "Help Center", path: "/help" },
    { label: "Contact Us", path: "/contact" },
    { label: "About Us", path: "/about" },
    { label: "Terms & Conditions", path: "/terms" },
  ]},
];

export default function SitemapPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl font-bold text-dark">Sitemap</h1>
          <p className="text-gray-500 text-sm mt-2">A complete overview of all pages on hiromart

.</p>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2"><s.icon size={16} className="text-primary" /> {s.title}</h3>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-sm text-gray-600 hover:text-primary transition flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-300" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
