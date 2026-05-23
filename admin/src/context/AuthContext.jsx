import { createContext, useContext, useState, useEffect } from "react";

import { API } from "../config";
const AuthContext = createContext();

export function useAuth() { return useContext(AuthContext); }

function loadSession() {
  const stored = localStorage.getItem("admin_token");
  const loginTime = localStorage.getItem("admin_login_time");
  if (stored && loginTime) {
    const elapsed = Date.now() - Number(loginTime);
    if (elapsed > 86400000) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_login_time");
      return { token: null, user: null };
    }
    return { token: stored, user: JSON.parse(localStorage.getItem("admin_user") || "null") };
  }
  return { token: null, user: null };
}

export default function AuthProvider({ children }) {
  const [{ token, user }, setSessionState] = useState(loadSession);

  function setToken(t) { setSessionState(prev => ({ ...prev, token: t })); }
  function setUser(u) { setSessionState(prev => ({ ...prev, user: u })); }

  function setSession(data) {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));
    localStorage.setItem("admin_login_time", String(Date.now()));
  }

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid email or password");
    const data = await res.json();
    setSession(data);
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Signup failed"); }
    const data = await res.json();
    setSession(data);
  };

  const googleLogin = async (credential) => {
    const res = await fetch(`${API}/auth/google`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Google sign-in failed"); }
    const data = await res.json();
    setSession(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_login_time");
  };

  return <AuthContext.Provider value={{ token, user, login, signup, googleLogin, logout }}>{children}</AuthContext.Provider>;
}
