// src/routes/AdminRoute.jsx

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="route__loading">
        Loading...
      </div>
    );
  }

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!user) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }} // 🔥 remember where user wanted to go
      />
    );
  }

  /* =========================
     NOT ADMIN (SAFE CHECK)
  ========================= */
  if (!user?.role || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  /* =========================
     ALLOWED
  ========================= */
  return children;
};

export default AdminRoute;