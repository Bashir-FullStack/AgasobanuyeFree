import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@shop.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try { await login(email, password); navigate("/"); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 dark:opacity-5" style={{ background: "radial-gradient(circle, #2275fc 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 dark:opacity-5" style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] dark:opacity-[0.02]" style={{ background: "radial-gradient(circle, #2275fc 0%, transparent 70%)" }} />
      </div>

      <div className={`w-full max-w-[420px] flex flex-col gap-8 relative transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2275fc] to-[#60A5FA] shadow-lg shadow-[#2275fc]/20 mb-4">
            <span className="text-2xl font-extrabold text-white">H</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Sign in to your admin dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 glass-strong shadow-xl" style={{ border: "1px solid var(--border-color)" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2.5 text-sm rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@hiromart.com"
                className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2275fc]/20"
                style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-[#2275fc]/20"
                style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#2275fc] focus:ring-[#2275fc]" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Keep me signed in</span>
              </label>
              <Link to="/admin-forgot-password" className="text-sm font-medium text-[#2275fc] hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-[#2275fc] to-[#60A5FA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#2275fc]/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
              ) : "Sign in"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: "1px solid var(--border-color)" }} /></div>
              <div className="relative flex justify-center"><span className="px-3 text-xs font-medium" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-muted)" }}>Or continue with</span></div>
            </div>
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

          <p className="mt-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#2275fc] hover:underline">Register now</Link>
          </p>
        </div>

        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} hiromart. All rights reserved.</p>
      </div>
    </div>
  );
}
