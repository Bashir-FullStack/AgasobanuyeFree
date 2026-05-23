import { FiShield, FiLock, FiCreditCard, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const features = [
  { icon: FiLock, title: "SSL Encryption", desc: "All transactions are protected with 256-bit SSL encryption to keep your data safe." },
  { icon: FiShield, title: "PCI Compliant", desc: "We adhere to Payment Card Industry Data Security Standards (PCI DSS)." },
  { icon: FiCreditCard, title: "Multiple Payment Methods", desc: "Pay with Visa, Mastercard, Mobile Money (MTN, Airtel), or Cash on Delivery." },
  { icon: FiCheckCircle, title: "Fraud Protection", desc: "Our system monitors transactions for suspicious activity in real time." },
];

export default function SecurePaymentPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[800px] mx-auto px-4 py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><FiShield size={28} className="text-green-500" /></div>
          <h1 className="text-3xl font-bold text-dark">Secure Payment</h1>
          <p className="text-gray-500 text-sm mt-2">Your security is our top priority. Every transaction is protected.</p>
        </div>
      </div>
      <div className="max-w-[800px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0"><f.icon size={20} className="text-green-500" /></div>
              <div><h4 className="text-sm font-semibold text-dark">{f.title}</h4><p className="text-xs text-gray-500 mt-1">{f.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <h2 className="text-lg font-bold text-dark mb-4">How We Protect You</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p><strong className="text-dark">End-to-End Encryption:</strong> Your payment details are encrypted from the moment you enter them until they reach the payment processor. We never store full credit card numbers on our servers.</p>
            <p><strong className="text-dark">Verified Payment Gateway:</strong> We partner with trusted payment providers who are fully PCI DSS compliant, ensuring your financial data is handled securely.</p>
            <p><strong className="text-dark">No Hidden Charges:</strong> The price you see at checkout is the final price. We don't add hidden fees or unexpected charges to your transactions.</p>
            <p><strong className="text-dark">Real-Time Monitoring:</strong> Our fraud detection system continuously monitors transactions for unusual activity and flags suspicious orders for manual review.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <FiAlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div><h4 className="text-sm font-semibold text-amber-800">Stay Safe Online</h4><p className="text-xs text-amber-700 mt-1">Never share your password, PIN, or one-time codes with anyone. Hiromart will never ask for your sensitive payment information via email or phone.</p></div>
        </div>
      </div>
    </div>
  );
}
