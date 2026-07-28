// src/pages/auth/RegisterOtp.jsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import OTPInput from "../../components/auth/OTPInput";
import Loader from "../../components/auth/Loader";

import { ROUTES } from "../../constants/routes";
import { useCountdown } from "../../hooks/useCountdown";
import { sendCustomerSignupOTP, verifyCustomerSignupOTP } from "../../api/auth.api";

import "../../styles/auth/forms.css";
import "../../styles/auth/otp.css";

export default function RegisterOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { time, seconds, restart } = useCountdown(30);

  const countdown =
    time ?? seconds;

  useEffect(() => {
    if (otp.length !== 4) return;

    const verify = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        await verifyCustomerSignupOTP({ email, code: otp });

        navigate(ROUTES.REGISTER_PROFILE, {
          state: { email },
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to verify verification code."
        );
        setOtp("");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [otp, email, navigate]);

  const handleResend = async () => {
    try {
      setError("");
      await sendCustomerSignupOTP({ email });
      restart();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to resend verification code."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-content auth-content">

        <AuthHeader title="Verification Code" />

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
          <Loader />
        ) : (
          <button
            className="otp-resend"
            disabled={countdown > 0}
            onClick={handleResend}
          >
            {countdown > 0
              ? `Resend in 00:${String(countdown).padStart(2, "0")}`
              : "Resend Code"}
          </button>
        )}

      </div>
    </div>
  );
}