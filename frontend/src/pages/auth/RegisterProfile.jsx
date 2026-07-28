import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthInput from "../../components/auth/AuthInput";
import PhoneInput from "../../components/auth/PhoneInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import Loader from "../../components/auth/Loader";

import { ROUTES } from "../../constants/routes";
import { completeCustomerSignup } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";

import "../../styles/auth/forms.css";

export default function RegisterProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const email = location.state?.email || "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+254",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please start from the sign-up step again.");
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await completeCustomerSignup({
        email,
        firstName: form.firstName,
        lastName: form.lastName,
        countryCode: form.countryCode,
        phoneNumber: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (response?.accessToken) {
        localStorage.setItem("token", response.accessToken);
      }

      setUser(response?.user ?? null);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-content">

      <form
        className="register-profile-form"
        onSubmit={handleSubmit}
      >
        <AuthInput
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            handleChange(
              "firstName",
              e.target.value
            )
          }
        />

        <AuthInput
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            handleChange(
              "lastName",
              e.target.value
            )
          }
        />

        <PhoneInput
          countryCode={form.countryCode}
          phone={form.phone}
          onCountryChange={(value) =>
            handleChange(
              "countryCode",
              value
            )
          }
          onPhoneChange={(value) =>
            handleChange(
              "phone",
              value
            )
          }
        />

        <PasswordInput
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            handleChange(
              "password",
              e.target.value
            )
          }
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) =>
            handleChange(
              "confirmPassword",
              e.target.value
            )
          }
        />

        {error && <div className="form-error">{error}</div>}

        <AuthButton type="submit" disabled={loading}>
          {loading ? <Loader /> : "Confirm"}
        </AuthButton>

      </form>

    </div>
  );
}