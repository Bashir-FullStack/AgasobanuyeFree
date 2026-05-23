import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiLock, FiCheck } from "react-icons/fi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { API } from "../config";

export default function ResetPasswordPage() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = paramToken || searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-dark mb-2">Invalid Link</h2>
          <p className="text-sm text-gray-500 mb-4">No reset token provided.</p>
          <Link to="/forgot-password" className="text-primary font-medium text-sm hover:underline">Request a new OTP</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center"><FiCheck size={28} className="text-green-500" /></div>
          <h2 className="text-xl font-bold text-dark mb-2">Password Reset!</h2>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <BsEyeSlash size={18} /> : <BsEye size={18} />}</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <div className="text-center"><Link to="/login" className="text-sm text-gray-500 hover:text-primary">Back to Login</Link></div>
        </form>
      </div>
    </div>
  );
}
