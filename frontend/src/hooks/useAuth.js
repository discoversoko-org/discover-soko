import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const { user, loading, login, logout, register, isAdmin, isUser } = context;

  return {
    user,
    loading,
    login,
    logout,
    register,

    /* role helpers */
    isAdmin,
    isUser,

    /* convenience flags */
    isAuthenticated: !!user,
  };
};