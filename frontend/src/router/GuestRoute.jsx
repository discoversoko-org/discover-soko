import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? (
    <Navigate to={ROUTES.HOME} replace />
  ) : (
    <Outlet />
  );
}
