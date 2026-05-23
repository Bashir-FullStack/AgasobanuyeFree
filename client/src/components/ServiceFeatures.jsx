import { FiTruck, FiRotateCcw, FiCreditCard, FiGift, FiHeadphones } from "react-icons/fi";

const features = [
  { icon: FiTruck, title: "Free Shipping", desc: "For all Orders Over FRw 130,000", gradient: "from-emerald-500 to-teal-600" },
  { icon: FiRotateCcw, title: "30 Days Returns", desc: "For an Exchange Product", gradient: "from-blue-500 to-indigo-600" },
  { icon: FiCreditCard, title: "Secured Payment", desc: "Payment Cards Accepted", gradient: "from-purple-500 to-violet-600" },
  { icon: FiGift, title: "Special Gifts", desc: "Our First Product Order", gradient: "from-orange-500 to-red-500" },
  { icon: FiHeadphones, title: "Support 24/7", desc: "Contact us Anytime", gradient: "from-cyan-500 to-blue-600" },
];

export default function ServiceFeatures() {
  return (
    <div className="bg-dark border-t border-gray-800/50">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-dark-soft/50 backdrop-blur-sm rounded-2xl px-5 py-6 border border-gray-800/30 hover:border-gray-700/50 transition-all card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                <f.icon size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-sm">{f.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
