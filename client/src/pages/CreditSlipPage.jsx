import { useState } from "react";
import { FiFileText, FiDownload, FiSearch, FiCheckCircle } from "react-icons/fi";

export default function CreditSlipPage() {
  const [orderId, setOrderId] = useState("");
  const [slip, setSlip] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) setSlip({ id: orderId, amount: "FRw 45,000", date: "May 20, 2026", status: "Approved", method: "Refund to Mobile Money" });
    else setSlip(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[600px] mx-auto px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><FiFileText size={28} className="text-primary" /></div>
          <h1 className="text-3xl font-bold text-dark">Credit Slip</h1>
          <p className="text-gray-500 text-sm mt-2">View and download your refund credit slips.</p>
          <form onSubmit={handleSearch} className="mt-6 flex items-center gap-2">
            <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter order ID" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition shadow-sm" />
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-sm flex items-center gap-2"><FiSearch size={16} /> Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 py-10">
        {slip ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex items-center gap-3">
              <FiCheckCircle size={20} className="text-green-500" />
              <span className="text-sm font-semibold text-green-700">Credit Slip Approved</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Order ID</span><p className="font-semibold text-dark">{slip.id}</p></div>
                <div><span className="text-gray-500">Amount</span><p className="font-semibold text-dark">{slip.amount}</p></div>
                <div><span className="text-gray-500">Date</span><p className="font-semibold text-dark">{slip.date}</p></div>
                <div><span className="text-gray-500">Refund Method</span><p className="font-semibold text-dark">{slip.method}</p></div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex gap-3">
                <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiDownload size={15} /> Download PDF</button>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition"><FiFileText size={15} /> Print</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <FiFileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-dark mb-2">Find Your Credit Slip</h3>
            <p className="text-sm text-gray-500">Enter your order ID to retrieve your credit slip. Credit slips are issued for returned or cancelled orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
