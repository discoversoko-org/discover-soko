// src/routes/ProtectedRoute.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return <div className="route__loading">Loading...</div>;
  }

  /* =========================
     NOT AUTHENTICATED
  ========================= */
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  /* ✅ ALLOW BOTH USER + ADMIN */
  return children;
};

export default ProtectedRoute;