// src/pages/auth/ForgotPassword.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import Loader from "../../components/auth/Loader";

import { ROUTES } from "../../constants/routes";
import { forgotPassword } from "../../api/auth.api";

import "../../styles/auth/forms.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await forgotPassword(email);

      navigate(
        ROUTES.FORGOT_OTP,
        {
          state: { email },
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-content">

      <AuthHeader
        title="Forgot Password"
      />

      <form
        className="forgot-password-form"
        onSubmit={handleSubmit}
      >
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

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

      </form>

    </div>
  );
}