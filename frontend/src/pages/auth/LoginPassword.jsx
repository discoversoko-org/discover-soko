// src/pages/auth/LoginPassword.jsx

import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import Loader from "../../components/auth/Loader";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

import "../../styles/auth/forms.css";

export default function LoginPassword() {
  const navigate = useNavigate();

  const location = useLocation();

  const email =
    location.state?.email || "";

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const { login } = useAuth();

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      navigate(ROUTES.HOME, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-content">

      <form
        className="login-password-form"
        onSubmit={handleSubmit}
      >
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          error={error}
        />

        <AuthButton
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Loader />
          ) : (
            "Confirm"
          )}
        </AuthButton>

        <Link
          className="auth-footer"
          to={ROUTES.FORGOT_PASSWORD}
        >
          Forgot Password?
        </Link>

      </form>

    </div>
  );
}