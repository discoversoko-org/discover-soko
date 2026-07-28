// src/pages/auth/ForgotOtp.jsx

import { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import OTPInput from "../../components/auth/OTPInput";

import { useCountdown } from "../../hooks/useCountdown";

import {
  verifyForgotOTP,
  forgotPassword,
} from "../../api/auth.api";

import { ROUTES } from "../../constants/routes";

import "../../styles/auth/forms.css";
import "../../styles/auth/otp.css";

export default function ForgotOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { time, seconds, restart } =
    useCountdown(30);

  const countdown =
    time ?? seconds;

  useEffect(() => {
    if (otp.length !== 4) return;

    let timerId;

    const verify = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        await verifyForgotOTP({
          email,
          code: otp,
        });

        setSuccess(
          "Verification code accepted. Redirecting..."
        );

        timerId = setTimeout(() => {
          navigate(ROUTES.NEW_PASSWORD, {
            state: {
              email,
              otp,
            },
          });
        }, 1000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Invalid verification code."
        );
        setOtp("");
      } finally {
        setLoading(false);
      }
    };

    verify();

    return () => clearTimeout(timerId);
  }, [otp, email, navigate]);

  return (
    <div className="page">
      <div className="page-content auth-content">

        <AuthHeader
          title="Verification Code"
        />

        <p className="otp-email">
          Sent to:
          <strong>{email}</strong>
        </p>

        <OTPInput
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError("");
            setSuccess("");
          }}
        />

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {loading ? (
          <div className="loader-placeholder" />
        ) : (
          <button
            className="otp-resend"
            disabled={countdown > 0}
            onClick={async () => {
              try {
                setError("");
                setSuccess("");

                await forgotPassword(email);
                restart();
              } catch (err) {
                setError(
                  err.response?.data?.message ||
                    "Unable to resend verification code."
                );
              }
            }}
          >
            {countdown > 0
              ? `Resend in 00:${String(
                  countdown
                ).padStart(2, "0")}`
              : "Resend Code"}
          </button>
        )}

      </div>
    </div>
  );
}