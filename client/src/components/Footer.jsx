import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiMessageSquare, FiClock, FiCheckCircle, FiSend } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../config";
import SubscribeModal from "./SubscribeModal";

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(() => sessionStorage.getItem("subscribed") === "true");
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "#", twitter: "#", instagram: "#", youtube: "#", linkedin: "#", tiktok: "#"
  });

  useEffect(() => {
    const checkEmail = user?.email || localStorage.getItem("subscriber_email");
    if (checkEmail) {
      fetch(`${API}/subscribe/check?email=${encodeURIComponent(checkEmail)}`)
        .then(r => r.json())
        .then(d => { if (d.subscribed) { setSubscribed(true); localStorage.setItem("subscriber_email", checkEmail); } })
        .catch(() => {});
    }
  }, [user?.email]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setEmail("");
        setSubscribed(true);
        localStorage.setItem("subscriber_email", email);
        setShowSubscribeModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${API}/settings`);
        if (res.ok) {
          const settings = await res.json();
          setSocialLinks({
            facebook: settings.facebook || "#", twitter: settings.twitter || "#",
            instagram: settings.instagram || "#", youtube: settings.youtube || "#",
            linkedin: settings.linkedin || "#", tiktok: settings.tiktok || "#"
          });
        }
      } catch (err) { console.error("Failed to load settings:", err); }
    };
    loadSettings();
  }, []);

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-[1430px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-14 border-b border-gray-800/50">
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Contact Us</h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-3"><span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><FiMapPin className="text-primary" size={15} /></span><span>hiromart

, 507-Union Trade Centre, Kigali, Rwanda</span></li>
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FiPhone className="text-primary" size={15} /></span><a href="tel:+250798388890" className="hover:text-primary transition">+250 798 388 890</a></li>
              <li className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FiMail className="text-primary" size={15} /></span><a href="mailto:bashirfullstack3@gmail.com" className="hover:text-primary transition break-all">bashirfullstack3@gmail.com</a></li>
              <li className="flex items-start gap-3"><span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><FiClock className="text-primary" size={15} /></span><div><span className="font-medium text-white block">Working Hours</span><span className="text-gray-500">Mon-Sat: 8:00 AM - 8:00 PM</span></div></li>
              <li className="flex items-start gap-3"><span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><FiMessageSquare className="text-primary" size={15} /></span><div><span className="font-medium text-white">Online Chat</span><p className="text-gray-500 text-xs">Get Expert Help</p></div></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Products</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/prices-drop", label: "Prices Drop" },
                { to: "/new-products", label: "New Products" },
                { to: "/best-sellers", label: "Best Sellers" },
                { to: "/sitemap", label: "Sitemap" },
                { to: "/stores", label: "Stores" },
                { to: "/accessories", label: "Accessories" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary" />{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Our Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/shop", label: "Delivery" },
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/secure-payment", label: "Secure Payment" },
                { to: "/contact", label: "Contact Us" },
                { to: "/about", label: "About Us" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-600" />{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Your Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/order-tracking", label: "Order Tracking" },
                { to: "/login", label: "Sign In" },
                { to: "/signup", label: "Create Account" },
                { to: "/discounts", label: "Discount" },
                { to: "/wishlist", label: "Wishlist" },
                { to: "/credit-slip", label: "Credit Slip" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-600" />{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-5 text-white">Get Our Latest Update !</h4>
            {subscribed ? (
              <div className="flex items-start gap-3 bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-800/20 rounded-2xl p-5">
                <FiCheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-300">You're subscribed!</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">You'll receive the latest deals and updates straight to your inbox.</p>
                </div>
              </div>
            ) : (
              <>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">Subscribe to get news about special discounts and promotions.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <FiSend className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm text-white bg-dark-soft/50 border border-gray-700/50 outline-none rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition" disabled={submitting} />
                </div>
                <button type="submit" disabled={submitting || !email} className="bg-primary text-white px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm">{submitting ? "Subscribing..." : "Subscribe →"}</button>
              </form>
              <SubscribeModal open={showSubscribeModal} onClose={() => setShowSubscribeModal(false)} />
              <label className="flex items-center gap-2 mt-3 text-xs text-gray-500"><input type="checkbox" className="accent-primary rounded" defaultChecked /> I agree to the terms and conditions</label>
              </>
            )}
            <div className="mt-5">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Follow Us</h5>
              <div className="flex items-center gap-2">
                {[
                  { Icon: FaFacebookF, key: "facebook" },
                  { Icon: FaTwitter, key: "twitter" },
                  { Icon: FaInstagram, key: "instagram" },
                  { Icon: FaYoutube, key: "youtube" },
                  { Icon: FaLinkedinIn, key: "linkedin" },
                  { Icon: FaTiktok, key: "tiktok" },
                ].map(({ Icon, key }) => (
                  <a key={key} href={socialLinks[key] || "#"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-dark-soft/50 border border-gray-700/30 flex items-center justify-center text-gray-500 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between py-8 gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 hiromart

. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            {["https://i.pinimg.com/736x/7f/eb/02/7feb0256dc66ee941c1a5d4c945ed60b.jpg", "https://i.pinimg.com/736x/a2/68/8b/a2688b6db24e7fdc9b6de25aa7196345.jpg", "https://i.pinimg.com/736x/d1/08/7d/d1087d1abc263b95a2bea32cd9e70ba0.jpg"].map((src, i) => (
              <div key={i} className="px-3 py-2 bg-white/5 rounded-lg"><img src={src} alt="Payment" className="h-6" /></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
