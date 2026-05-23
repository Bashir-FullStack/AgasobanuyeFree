import { FiTruck } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GoGift } from "react-icons/go";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useFetch } from "../utils/api";

export default function FreeShipping() {
  const { data: deliverySettings } = useFetch("/delivery/settings");
  const freeThreshold = deliverySettings?.freeThreshold || 260000;

  const items = [
    { icon: FiTruck, title: "Free Shipping", desc: `For all orders over FRw ${Number(freeThreshold).toLocaleString()}` },
    { icon: RiSecurePaymentLine, title: "Secure Payment", desc: "100% secure payment" },
    { icon: GoGift, title: "Gift Voucher", desc: "New users get FRw 13,000" },
    { icon: MdOutlineSupportAgent, title: "24/7 Support", desc: "Dedicated support center" },
  ];

  return (
    <section className="mb-10">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 md:px-5 py-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary-lighter flex items-center justify-center text-primary shrink-0"><Icon size={24} /></div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
