import { useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { API } from "../config";

export default function OTPVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

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
      navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
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
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-dark mb-2">Invalid Link</h2>
          <p className="text-sm text-gray-500 mb-4">No email provided. Please start again.</p>
          <Link to="/forgot-password" className="text-primary font-medium text-sm hover:underline">Go to Forgot Password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
            <FiShield size={26} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-dark">Verify OTP</h2>
          <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code sent to <strong className="text-gray-700">{email}</strong></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
                className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
            ))}
          </div>
          <button type="submit" disabled={loading || otp.join("").length !== 6} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Didn't receive it?{" "}
            <button type="button" onClick={handleResend} disabled={loading} className="text-primary font-medium hover:underline disabled:opacity-50">Resend OTP</button>
          </p>
          <div className="text-center">
            <Link to="/forgot-password" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"><FiArrowLeft size={14} /> Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
