// src/pages/auth/RegisterEmail.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import Loader from "../../components/auth/Loader";

import { ROUTES } from "../../constants/routes";
import { sendCustomerSignupOTP } from "../../api/auth.api";

import "../../styles/auth/forms.css";

export default function RegisterEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendCustomerSignupOTP({ email: trimmedEmail });

      navigate(ROUTES.REGISTER_OTP, {
        state: { email: trimmedEmail },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-content">

      <AuthHeader
        title="Create your account"
      />

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {error && <div className="form-error">{error}</div>}

        <AuthButton type="submit" disabled={loading}>
          {loading ? <Loader /> : "Sign up"}
        </AuthButton>
      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <span
          onClick={() =>
            navigate(ROUTES.LOGIN_EMAIL)
          }
        >
          Login
        </span>
      </p>

    </div>
  );
}