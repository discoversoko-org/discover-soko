import { Routes, Route } from "react-router-dom";

/* PUBLIC */
import Home from "../pages/public/Home";
import BusinessDetails from "../pages/public/BusinessDetails";
import CategoryPage from "../pages/public/CategoryPage";

/* AUTH */
import Auth from "../pages/auth/Auth";

/* USER */
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";

/* ADMIN */
import AdminDashboard from "../pages/admin/AdminDashboard"; // main hub
import AdminStats from "../pages/admin/Dashboard"; // stats page
import ManageUsers from "../pages/admin/ManageUsers";
import ManageBusinesses from "../pages/admin/ManageBusinesses";
import ManageCategories from "../pages/admin/ManageCategories";
import Reports from "../pages/admin/Reports";

/* NEW ADMIN FEATURES */
import BusinessApproval from "../components/admin/BusinessApproval";
import HeroSlides from "../components/admin/HeroSlides";

/* GUARDS */
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />
      <Route path="/business/:id" element={<BusinessDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} />

      {/* ================= AUTH ================= */}
      <Route path="/auth" element={<Auth />} />

      {/* ================= USER ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      {/* MAIN ADMIN HUB */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ADMIN STATS */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminStats />
          </AdminRoute>
        }
      />

      {/* BUSINESS APPROVAL */}
      <Route
        path="/admin/approvals"
        element={
          <AdminRoute>
            <BusinessApproval />
          </AdminRoute>
        }
      />

      {/* HERO SLIDES */}
      <Route
        path="/admin/hero"
        element={
          <AdminRoute>
            <HeroSlides />
          </AdminRoute>
        }
      />

      {/* EXISTING ADMIN FEATURES */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/businesses"
        element={
          <AdminRoute>
            <ManageBusinesses />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <ManageCategories />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <Reports />
          </AdminRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}