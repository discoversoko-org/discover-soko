import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api/auth.api";

/* =========================================
   CONTEXT
========================================= */

export const AuthContext = createContext(null);

/* =========================================
   PROVIDER
========================================= */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD CURRENT USER
  ========================================= */

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        setUser(response?.user ?? null);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* =========================================
     LOGIN
  ========================================= */

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const token = response?.accessToken;
    const currentUser = response?.user;

    if (token) {
      localStorage.setItem("token", token);
    }

    setUser(currentUser);

    return currentUser;
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore API logout errors
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  const value = useMemo(
    () => ({
      user,
      loading,

      login,
      logout,

      setUser,

      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}