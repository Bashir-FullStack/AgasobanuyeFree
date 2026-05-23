import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft, FiSmartphone } from "react-icons/fi";
import { API } from "../config";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, method }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive an OTP code</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Receive OTP via</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setMethod("email")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium transition ${method === "email" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                <FiMail size={16} /> Email
              </button>
              <button type="button" onClick={() => setMethod("sms")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium transition ${method === "sms" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                <FiSmartphone size={16} /> SMS
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"><FiArrowLeft size={14} /> Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
