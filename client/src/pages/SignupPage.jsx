import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup(firstName, lastName, email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Join us and start shopping</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <BsEyeSlash size={18} /> : <BsEye size={18} />}</button>
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm text-gray-500"><input type="checkbox" className="mt-0.5 rounded" /> I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a></label>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-3 text-center">Or continue with</p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed")}
              theme="outline"
              size="large"
              shape="rectangular"
              text="signup_with"
              width="300"
            />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-primary font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
