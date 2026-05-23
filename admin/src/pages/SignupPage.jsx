import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try { await signup(`${firstName} ${lastName}`.trim(), email, password); navigate("/"); }
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
    <div className="min-h-screen bg-[#F2F7FB] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[540px] flex flex-col gap-8">
        <div className="text-center">
          <img src="https://res.cloudinary.com/dkmdeqbof/image/upload/v1779343582/Gemini_Generated_Image_z0294uz0294uz029-removebg-preview_rv367t.png" alt="hiromart" className="h-12 w-auto mx-auto mb-2" />
        </div>
        <div className="bg-white rounded-[20px] p-[30px] flex flex-col gap-10 shadow-[0px_4px_24px_2px_rgba(20,25,38,0.05)]">
          <div>
            <h3 className="text-[24px] font-bold text-[#111] leading-[37px]">Create your account</h3>
            <p className="text-sm text-[#575864] mt-1">Enter your personal details to create account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Your username <span className="text-[#FF5200]">*</span></label>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]"
                />
              </div>
            </fieldset>

            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Email address <span className="text-[#FF5200]">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]"
              />
            </fieldset>

            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Password <span className="text-[#FF5200]">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter your password"
                className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]"
              />
            </fieldset>

            <fieldset>
              <label className="block text-sm font-bold text-[#111] mb-2.5">Confirm password <span className="text-[#FF5200]">*</span></label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-[22px] py-[14px] text-sm text-[#111] bg-[#ECF0F4] border border-[#ECF0F4] rounded-xl outline-none focus:border-[#2275fc] transition placeholder:text-[#858B93]"
              />
            </fieldset>

            <div className="flex items-center">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" required className="w-[22px] h-[22px] rounded-md border-[#ECF0F4] text-[#2275fc] focus:ring-[#2275fc]" />
                <span className="text-sm text-[#575864]">Agree with Privacy Policy</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full h-[50px] bg-[#2275fc] border border-[#2275fc] text-white text-sm font-bold rounded-xl hover:bg-white hover:text-[#2275fc] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating account...</>
              ) : "Create Account"}
            </button>
          </form>

          <div>
            <p className="text-[12px] text-[#95989D] mb-4 text-center">Or continue with social account</p>
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

          <p className="text-sm text-[#575864] text-center">
            You have an account?{" "}
            <Link to="/login" className="text-[#2275fc] font-medium hover:underline">Login Now</Link>
          </p>
        </div>

        <p className="text-[12px] text-[#95989D] text-center">Copyright &copy; 2024 hiromart, All rights reserved.</p>
      </div>
    </div>
  );
}
