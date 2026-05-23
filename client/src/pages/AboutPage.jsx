import { FiShield, FiTruck, FiHeadphones, FiRefreshCw, FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: FiHeart },
  { label: "Products Delivered", value: "200K+", icon: FiTruck },
  { label: "Years Experience", value: "8+", icon: FiStar },
  { label: "Support Team", value: "24/7", icon: FiHeadphones },
];

const team = [
  { name: "Sharif Hakorimana", role: "Founder & CEO", img: "https://picsum.photos/seed/team1/200/200" },
  { name: "Alice Mukamana", role: "Head of Operations", img: "https://picsum.photos/seed/team2/200/200" },
  { name: "David Niyonzima", role: "Lead Developer", img: "https://picsum.photos/seed/team3/200/200" },
  { name: "Grace Uwimana", role: "Customer Success", img: "https://picsum.photos/seed/team4/200/200" },
];

const values = [
  { icon: FiShield, title: "Trust & Security", desc: "Your data and transactions are protected with industry-standard encryption." },
  { icon: FiTruck, title: "Fast Delivery", desc: "We deliver across the country within 5-7 business days, express available." },
  { icon: FiHeadphones, title: "24/7 Support", desc: "Our team is always ready to help with any questions or concerns." },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day return policy with full refund, no questions asked." },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">About Hiromart</h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Hiromart is your trusted online marketplace for quality fashion, electronics, home goods, and more. 
            We connect customers with premium products at unbeatable prices, delivered right to your door.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition">
              <s.icon size={24} className="mx-auto text-primary mb-3" />
              <p className="text-2xl font-bold text-dark">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-12">
          <h2 className="text-xl font-bold text-dark mb-4">Our Story</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>Hiromart started in 2018 with a simple mission: make quality products accessible to everyone in Rwanda. What began as a small online store has grown into a trusted marketplace serving thousands of customers nationwide.</p>
            <p>We partner with top brands and local artisans to bring you a curated selection of fashion, electronics, home essentials, and more. Every product is vetted for quality, and every order is handled with care.</p>
            <p>Our team is passionate about creating a seamless shopping experience — from browsing to checkout to delivery. We believe great service is just as important as great products.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-dark mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <v.icon size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-dark">{v.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-dark mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {team.map((m) => (
            <div key={m.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition">
              <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
              <h4 className="text-sm font-semibold text-dark">{m.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{m.role}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8 text-center">
          <h3 className="text-lg font-bold text-dark mb-2">Ready to start shopping?</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">Browse our latest collections and find something you love.</p>
          <Link to="/shop" className="inline-flex bg-primary text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/20">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
