import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginRequest, registerRequest, logoutRequest, profileRequest } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("air_token");
    if (!token) {
      setLoading(false);
      return;
    }
    profileRequest()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("air_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginRequest({ email, password });
    localStorage.setItem("air_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await registerRequest({ name, email, password });
    localStorage.setItem("air_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem("air_token");
    setUser(null);
  }, []);

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

export default AuthContext;
