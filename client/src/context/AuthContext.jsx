import { createContext, useContext, useState, useEffect } from "react";

import { API } from "../config";
const AuthContext = createContext(null);

function loadUser() {
  const stored = localStorage.getItem("classyshop_token");
  const loginTime = localStorage.getItem("classyshop_login_time");
  if (stored && loginTime) {
    const elapsed = Date.now() - Number(loginTime);
    if (elapsed > 86400000) {
      localStorage.removeItem("classyshop_token");
      localStorage.removeItem("classyshop_user");
      localStorage.removeItem("classyshop_login_time");
      return null;
    }
    return JSON.parse(localStorage.getItem("classyshop_user") || "null");
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  function setSession(data) {
    setUser(data.user);
    localStorage.setItem("classyshop_token", data.token);
    localStorage.setItem("classyshop_user", JSON.stringify(data.user));
    localStorage.setItem("classyshop_login_time", String(Date.now()));
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

  const signup = async (firstName, lastName, email, password) => {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, password }),
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
    setUser(null);
    localStorage.removeItem("classyshop_token");
    localStorage.removeItem("classyshop_user");
    localStorage.removeItem("classyshop_login_time");
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("classyshop_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
