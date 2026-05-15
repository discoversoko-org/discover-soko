import { Routes, Route } from "react-router-dom";

/* layouts */
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

/* guards */
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

/* public */
import Home from "../pages/public/Home";
import BusinessDetails from "../pages/public/BusinessDetails";

/* auth */
import Auth from "../pages/auth/Auth";

/* user */
import Dashboard from "../pages/user/Dashboard";
import CreateBusiness from "../pages/user/CreateBusiness";
import EditBusiness from "../pages/user/EditBusiness";
import Profile from "../pages/user/Profile";

/* admin */
import AdminDashboard from "../pages/admin/AdminDashboard";
import BusinessApproval from "../pages/admin/BusinessApproval";
import Users from "../pages/admin/Users";
import HeroSlides from "../pages/admin/HeroSlides";

const App = () => {
  return (
    <Routes>

      {/* 🌍 PUBLIC */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Home />} />
      </Route>

      {/* 📄 BUSINESS DETAILS */}
      <Route path="/business/:id" element={<BusinessDetails />} />

      {/* 🔐 AUTH */}
      <Route path="/auth" element={<Auth />} />

      {/* 👤 USER AREA */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="business/create" element={<CreateBusiness />} />
        <Route path="business/edit/:id" element={<EditBusiness />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 🛡️ ADMIN AREA */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="business-approval" element={<BusinessApproval />} />
        <Route path="users" element={<Users />} />
        <Route path="hero-slides" element={<HeroSlides />} />
      </Route>

    </Routes>
  );
};

export default App;