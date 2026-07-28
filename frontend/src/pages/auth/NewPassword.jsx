// src/pages/auth/NewPassword.jsx

import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import Loader from "../../components/auth/Loader";
import SuccessSheet from "../../components/auth/SuccessSheet";

import {
  resetPassword,
  getCurrentUser,
} from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

import { ROUTES } from "../../constants/routes";

import "../../styles/auth/forms.css";

export default function NewPassword() {
  const navigate = useNavigate();

  const location = useLocation();

  const { setUser } = useAuth();

  const email =
    location.state?.email || "";

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [accessToken, setAccessToken] =
    useState("");

  const [resetUser, setResetUser] =
    useState(null);

  const [error, setError] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        newPassword: password,
        confirmPassword,
      });

      if (response?.accessToken) {
        setAccessToken(response.accessToken);
      }

      if (response?.user) {
        setResetUser(response.user);
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-content">

        <AuthHeader
          title="Create New Password"
        />

        <form
          className="new-password-form"
          onSubmit={submit}
        >
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <PasswordInput
            placeholder="Confirm Password"
            value={
              confirmPassword
            }
            onChange={(e) =>
              setConfirmPassword(
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

        </form>

      </div>

      <SuccessSheet
        open={success}
        title="Success"
        message="Your password has been changed successfully."
        buttonText="Go to Home"
        onContinue={async () => {
          if (accessToken) {
            localStorage.setItem("token", accessToken);
          }

          if (resetUser) {
            setUser(resetUser);
          } else if (accessToken) {
            const currentUser = await getCurrentUser();
            if (currentUser?.user) {
              setUser(currentUser.user);
            }
          }

          navigate(ROUTES.HOME, {
            replace: true,
          });
        }}
      />
    </>
  );
}