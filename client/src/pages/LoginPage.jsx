import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, googleLogin } = useAuth();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
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
          <h2 className="text-2xl font-bold text-dark">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <BsEyeSlash size={18} /> : <BsEye size={18} />}</button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" className="rounded" /> Remember me</label>
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
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
              text="signin_with"
              width="300"
            />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-primary font-medium hover:underline">Create one</Link></p>
      </div>
    </div>
  );
}
