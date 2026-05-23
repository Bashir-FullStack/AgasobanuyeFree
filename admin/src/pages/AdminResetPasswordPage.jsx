import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

export default function AdminResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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
      <div className="min-h-screen bg-[#F2F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] p-[30px] text-center shadow w-full max-w-[540px]">
          <h2 className="text-xl font-bold text-[#111] mb-2">Invalid Link</h2>
          <p className="text-sm text-[#575864] mb-4">No reset token provided.</p>
          <Link to="/admin-forgot-password" className="text-[#2275fc] font-medium hover:underline">Request a new OTP</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F2F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] p-[30px] text-center shadow w-full max-w-[540px]">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-xl font-bold text-[#111] mb-2">Password Reset!</h2>
          <p className="text-sm text-[#575864]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F7FB] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[540px] flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111]">Hiromart</h1>
          <p className="text-sm text-[#575864]">Admin Dashboard</p>
        </div>
        <div className="bg-white rounded-[20px] p-[30px] flex flex-col gap-6 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <div>
            <h3 className="text-[24px] font-bold text-[#111]">Reset Password</h3>
            <p className="text-sm text-[#575864] mt-1">Enter your new password</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">New Password <span className="text-[#FF5200]">*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
            </fieldset>
            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Confirm Password <span className="text-[#FF5200]">*</span></label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" className="w-full px-[22px] py-[14px] text-sm bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]" />
            </fieldset>
            <button type="submit" disabled={loading} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] border border-[#2275fc] transition-all disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-[#2275fc] font-medium hover:underline">Back to Login</Link>
            </div>
          </form>
        </div>
        <p className="text-[12px] text-[#95989D] text-center">Copyright &copy; 2024 hiromart, All rights reserved.</p>
      </div>
    </div>
  );
}
