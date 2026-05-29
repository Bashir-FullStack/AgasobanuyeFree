import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiX, FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiUsers } from "react-icons/fi";

const bannerUrl = "https://static.vecteezy.com/system/resources/thumbnails/059/145/924/small_2x/vibrant-fashion-sale-banner-design-for-seasonal-store-promotions-photo.jpg";

const SHOW_DELAY = 30000; // 30 seconds before banner appears

export default function SignUpBanner() {
  const { isLoggedIn, googleLogin } = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) return;
    if (sessionStorage.getItem("signup_banner_dismissed") === "true") return;
    const timer = setTimeout(() => setShow(true), SHOW_DELAY);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  if (!show || isLoggedIn) return null;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
    } catch {
      navigate("/signup");
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoining(true);
    setTimeout(() => {
      navigate(`/signup?email=${encodeURIComponent(email.trim())}`);
    }, 400);
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("signup_banner_dismissed", "true");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scale-in flex flex-col md:flex-row">
        <button onClick={dismiss} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 md:bg-white/80 flex items-center justify-center text-white md:text-gray-500 hover:bg-black/40 md:hover:bg-white transition" aria-label="Close">
          <FiX size={18} />
        </button>

        <div className="hidden md:block w-[42%] shrink-0 relative overflow-hidden bg-gray-100">
          <img src={bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-white/90 text-xs">
              <FiUsers size={14} />
              <span>12,000+ happy shoppers</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <span className="inline-block text-[11px] font-semibold text-green-600 uppercase tracking-[0.2em] mb-2">Welcome to hiromart

</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Unlock Exclusive Deals &<br />
              <span className="text-green-600">Join 12,000+ Happy Shoppers</span>
            </h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Sign up today and get <strong className="text-gray-800">FRw 13,000 welcome bonus</strong>, early access to flash sales, and free shipping on your first order.
            </p>

            <form onSubmit={handleEmailSubmit} className="mt-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                  />
                </div>
                <button type="submit" disabled={joining || !email.trim()} className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:from-green-700 hover:to-emerald-600 transition disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-green-200 shrink-0">
                  {joining ? "Joining..." : "Get Started"}
                  <FiArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-gray-300 text-xs">or</span>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => navigate("/signup")}
                size="small"
                theme="outline"
                shape="pill"
                text="signup_with"
                width="160"
              />
            </div>

            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-gray-400 text-[11px]">
              <span className="flex items-center gap-1"><FiShield size={12} /> Secure checkout</span>
              <span className="flex items-center gap-1"><FiTruck size={12} /> Free shipping</span>
              <span className="flex items-center gap-1"><FiRefreshCw size={12} /> Easy returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
