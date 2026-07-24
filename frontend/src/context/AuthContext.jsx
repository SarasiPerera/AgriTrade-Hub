import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("agritrade_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(email, password) {
    // FastAPI's OAuth2PasswordRequestForm expects form-encoded data with "username"
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const { data } = await client.post("/api/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("agritrade_token", data.access_token);
    localStorage.setItem("agritrade_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    await client.post("/api/auth/register", payload);
    // auto-login right after registering
    return login(payload.email, payload.password);
  }

  function logout() {
    localStorage.removeItem("agritrade_token");
    localStorage.removeItem("agritrade_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
