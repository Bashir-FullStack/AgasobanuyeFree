import { useState } from "react";
import { FiSearch, FiChevronDown, FiTruck, FiRotateCcw, FiShield, FiCreditCard, FiMail, FiMessageCircle, FiHeadphones } from "react-icons/fi";
import { Link } from "react-router-dom";

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days within the country. Express shipping is available at checkout for 2-3 business day delivery." },
  { q: "What is your return policy?", a: "You can return items within 30 days of delivery for a full refund. Items must be unused and in original packaging." },
  { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in the My Orders section of your account." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, Mobile Money (MTN, Airtel), and Cash on Delivery for select locations." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement. After that, please contact our support team for assistance." },
  { q: "Do you offer international shipping?", a: "Currently we only ship within the country. International shipping will be available soon." },
  { q: "How do I contact customer support?", a: "You can reach us via email, live chat, or phone. Our support team is available Monday-Saturday, 8AM-6PM." },
  { q: "Is my personal information secure?", a: "Yes, we use industry-standard encryption to protect your data. We never share your information with third parties." },
];

const topics = [
  { icon: FiTruck, title: "Shipping & Delivery", desc: "Shipping times, costs, and tracking info" },
  { icon: FiRotateCcw, title: "Returns & Exchanges", desc: "Return policy and refund process" },
  { icon: FiShield, title: "Payment & Security", desc: "Payment methods and secure checkout" },
  { icon: FiCreditCard, title: "Billing & Pricing", desc: "Invoices, discounts, and promotions" },
  { icon: FiHeadphones, title: "Account Support", desc: "Login issues, profile & order help" },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-4 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiHeadphones size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark">Help Center</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">Find answers to common questions or get in touch with our support team.</p>
          <div className="relative max-w-lg mx-auto mt-6">
            <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for answers..." className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition shadow-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {topics.map((t) => (
            <button key={t.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md hover:border-primary transition group">
              <t.icon size={24} className="mx-auto text-primary mb-3" />
              <h4 className="text-sm font-semibold text-dark group-hover:text-primary transition">{t.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-dark mb-6 pb-3 border-b border-gray-100">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">No results found for "{search}"</p>
            ) : (
              filtered.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="text-sm font-medium text-dark pr-4">{faq.q}</span>
                    <FiChevronDown size={16} className={`shrink-0 text-gray-400 transition ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8 text-center">
          <FiMessageCircle size={32} className="mx-auto text-primary mb-3" />
          <h3 className="text-lg font-bold text-dark mb-2">Still need help?</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">Our support team is ready to assist you. Reach out and we'll get back to you within 24 hours.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:support@hiromart

.com" className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition shadow-sm"><FiMail size={16} /> Email Us</a>
            <a href="#" className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition">Live Chat</a>
          </div>
        </div>
      </div>
    </div>
  );
}
