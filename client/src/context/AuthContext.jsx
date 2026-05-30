import { createContext, useContext, useState, useEffect } from "react";

import { API } from "../config";
const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function loadSession() {
  try {
    const token = localStorage.getItem("agasobanuye_token");
    if (!token) return { user: null, token: null };

    const payload = decodeJwtPayload(token);
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem("agasobanuye_token");
      localStorage.removeItem("agasobanuye_user");
      return { user: null, token: null };
    }

    const raw = localStorage.getItem("agasobanuye_user");
    const user = raw ? JSON.parse(raw) : null;
    return { user, token };
  } catch {
    localStorage.removeItem("agasobanuye_token");
    localStorage.removeItem("agasobanuye_user");
    return { user: null, token: null };
  }
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }) {
  const initial = loadSession();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);

  function setSession(data) {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("agasobanuye_token", data.token);
    localStorage.setItem("agasobanuye_user", JSON.stringify(data.user));
  }

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid email or password");
    const data = await res.json();
    setSession(data);
  };

  const signup = async (firstName, lastName, email, password) => {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Signup failed");
    }
    const data = await res.json();
    setSession(data);
  };

  const googleLogin = async (credential) => {
    const res = await fetch(`${API}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Google sign-in failed");
    }
    const data = await res.json();
    setSession(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("agasobanuye_token");
    localStorage.removeItem("agasobanuye_user");
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("agasobanuye_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, authHeaders, login, signup, googleLogin, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
