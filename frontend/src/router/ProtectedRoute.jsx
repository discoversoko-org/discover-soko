import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.LOGIN_EMAIL} replace />
  );
}