import { Link } from "react-router-dom";
import { FiHome, FiShoppingBag, FiSearch } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-6 relative">
          <div className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-gray-100 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-xl -mt-4">
              <span className="text-4xl md:text-5xl font-black text-white">!</span>
            </div>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md">
            <FiHome size={18} />
            Back to Home
          </Link>
          <Link to="/shop" className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition">
            <FiShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3">Try searching instead</p>
          <form action="/shop" method="get" className="flex max-w-sm mx-auto">
            <input name="search" type="text" placeholder="Search products..." className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-l-xl outline-none focus:border-primary transition" />
            <button type="submit" className="bg-primary text-white px-5 py-2.5 rounded-r-xl text-sm font-semibold hover:bg-primary-dark transition flex items-center gap-1">
              <FiSearch size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
