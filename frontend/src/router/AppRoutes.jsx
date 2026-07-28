// src/router/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import Splash from "../pages/auth/Splash";
import Welcome from "../pages/auth/Welcome";

import RegisterEmail from "../pages/auth/RegisterEmail";
import RegisterOtp from "../pages/auth/RegisterOtp";
import RegisterProfile from "../pages/auth/RegisterProfile";

import LoginEmail from "../pages/auth/LoginEmail";
import LoginPassword from "../pages/auth/LoginPassword";

import ForgotPassword from "../pages/auth/ForgotPassword";
import ForgotOtp from "../pages/auth/ForgotOtp";
import NewPassword from "../pages/auth/NewPassword";

import Home from "../pages/home/Home";

import AuthLayout from "../layouts/AuthLayout";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

import { ROUTES } from "../constants/routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ======================================================
          App Entry (Always Starts Here)
      ====================================================== */}

      <Route
        path={ROUTES.SPLASH}
        element={<Splash />}
      />

      {/* ======================================================
          Guest Routes
      ====================================================== */}

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          {/* Welcome */}

          <Route
            path={ROUTES.WELCOME}
            element={<Welcome />}
          />

          {/* Register */}

          <Route
            path={ROUTES.REGISTER_EMAIL}
            element={<RegisterEmail />}
          />

          <Route
            path={ROUTES.REGISTER_OTP}
            element={<RegisterOtp />}
          />

          <Route
            path={ROUTES.REGISTER_PROFILE}
            element={<RegisterProfile />}
          />

          {/* Login */}

          <Route
            path={ROUTES.LOGIN_EMAIL}
            element={<LoginEmail />}
          />

          <Route
            path={ROUTES.LOGIN_PASSWORD}
            element={<LoginPassword />}
          />

          {/* Forgot Password */}

          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />

          <Route
            path={ROUTES.FORGOT_OTP}
            element={<ForgotOtp />}
          />

          <Route
            path={ROUTES.NEW_PASSWORD}
            element={<NewPassword />}
          />
        </Route>
      </Route>

      {/* ======================================================
          Protected Routes
      ====================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTES.HOME}
          element={<Home />}
        />
      </Route>

      {/* ======================================================
          Fallback
      ====================================================== */}

      <Route
        path="*"
        element={<Splash />}
      />
    </Routes>
  );
}