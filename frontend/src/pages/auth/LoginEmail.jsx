// src/pages/auth/LoginEmail.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import { ROUTES } from "../../constants/routes";

import "../../styles/auth/forms.css";

export default function LoginEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    navigate(
      ROUTES.LOGIN_PASSWORD,
      {
        state: { email },
      }
    );
  };

  return (
    <div className="auth-content">

      <AuthHeader
        title="Log into your account"
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

        <AuthButton type="submit">
          Log In
        </AuthButton>
      </form>

      <p className="auth-footer">
        Don't have an account?{" "}
        <span
          onClick={() =>
            navigate(ROUTES.REGISTER_EMAIL)
          }
        >
          Sign up
        </span>
      </p>

    </div>
  );
}