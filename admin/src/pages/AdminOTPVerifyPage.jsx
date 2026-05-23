import { useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function AdminOTPVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (data.length === 6) {
      setOtp(data.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the full 6-digit code"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      navigate(`/admin-reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#F2F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] p-[30px] text-center shadow w-full max-w-[540px]">
          <h2 className="text-xl font-bold text-[#111] mb-2">Invalid Link</h2>
          <p className="text-sm text-[#575864] mb-4">No email provided.</p>
          <Link to="/admin-forgot-password" className="text-[#2275fc] font-medium hover:underline">Request OTP</Link>
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
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-[#2275fc]/10 rounded-full flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2275fc" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <h3 className="text-[24px] font-bold text-[#111]">Verify OTP</h3>
            <p className="text-sm text-[#575864] mt-1">Enter the code sent to <strong>{email}</strong></p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl outline-none focus:border-[#2275fc] focus:ring-1 focus:ring-[#2275fc] transition"
                />
              ))}
            </div>
            <button type="submit" disabled={loading || otp.join("").length !== 6} className="w-full h-[50px] bg-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] border border-[#2275fc] transition-all disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-center text-sm text-[#575864]">
              Didn't receive it?{" "}
              <button type="button" onClick={handleResend} disabled={loading} className="text-[#2275fc] font-medium hover:underline disabled:opacity-50">Resend OTP</button>
            </p>
            <div className="text-center">
              <Link to="/admin-forgot-password" className="text-sm text-[#2275fc] font-medium hover:underline">Back</Link>
            </div>
          </form>
        </div>
        <p className="text-[12px] text-[#95989D] text-center">Copyright &copy; 2024 hiromart, All rights reserved.</p>
      </div>
    </div>
  );
}
