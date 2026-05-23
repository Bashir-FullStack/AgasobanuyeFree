import { FiSmartphone } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function DownloadApp() {
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-6 z-40">
      <Link
        to="#"
        className="flex items-center gap-2 bg-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-800 hover:scale-105 transition-all border border-white/10"
      >
        <FiSmartphone size={18} />
        Get Our App
      </Link>
    </div>
  );
}
