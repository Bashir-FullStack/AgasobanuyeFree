import { FiCheck, FiX, FiGift, FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

const bannerUrl = "https://i.pinimg.com/1200x/52/53/00/5253009b8a0080f2abcee8268e38d800.jpg";

export default function SubscribeModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition">
          <FiX size={18} />
        </button>

        <div className="h-44 relative overflow-hidden bg-gray-100">
          <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
            <FiGift size={32} className="text-white" />
          </div>
        </div>

        <div className="p-6 md:p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">You're Now Part of the Family!</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
            Welcome to the inner circle! Get ready for exclusive deals, members-only flash sales, and first dibs on new arrivals — delivered straight to your inbox.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-5 border border-green-100 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <FiCheck size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Welcome Bonus Unlocked</p>
                <p className="text-xs text-gray-500 mt-0.5">FRw 13,000 credit + free shipping on your first order</p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white px-7 py-3 rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-600 transition shadow-md shadow-green-200 flex items-center justify-center gap-2">
            Start Shopping <FiArrowRight size={16} />
          </button>

          <div className="flex items-center justify-center gap-4 mt-4 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1"><FiShield size={12} /> Secure</span>
            <span className="flex items-center gap-1"><FiTruck size={12} /> Free shipping</span>
            <span className="flex items-center gap-1"><FiRefreshCw size={12} /> Easy returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
