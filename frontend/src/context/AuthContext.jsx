import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { loginUser, registerUser } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     NORMALIZE RESPONSE
  ========================= */
  const extractUser = (res) => {
    return (
      res.data?.user ||
      res.data?.data?.user ||
      res.data?.data ||
      res.data
    );
  };

  /* =========================
     LOAD USER (GLOBAL SYNC)
  ========================= */
  const loadUser = useCallback(async () => {
    try {
      const res = await API.get("/users/me");
      const userData = extractUser(res);
      setUser(userData);
    } catch (error) {
      console.error("Auth load error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    loadUser();
  }, [loadUser]);

  /* =========================
     LOGIN
  ========================= */
  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);

      // 🔥 ALWAYS reload full user
      await loadUser();

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const register = async (formData) => {
    try {
      const res = await registerUser(formData);

      const token = res.data?.token || res.data?.data?.token;
      if (!token) throw new Error("No token returned");

      localStorage.setItem("token", token);

      // 🔥 ALWAYS reload full user
      await loadUser();

    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    window.location.replace("/auth"); // ✅ FIXED
  };

  /* =========================
     ROLE HELPERS
  ========================= */
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,          // 🔥 IMPORTANT (for profile updates)
        loading,
        login,
        register,
        logout,
        isAdmin,
        isUser,
        isAuthenticated,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};