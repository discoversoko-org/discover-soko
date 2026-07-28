import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PropTypes from "prop-types";

import "../../styles/auth/inputs.css";

export default function PasswordInput({
  placeholder = "Password",
  value = "",
  onChange = () => {},
  error,
  success,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="auth-input-group">

      <div className="password-wrapper">

        <input
          className={`auth-input
            ${value ? "input-filled" : ""}
            ${error ? "input-error" : ""}
            ${success ? "input-success" : ""}
          `}
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <FiEyeOff />
          ) : (
            <FiEye />
          )}
        </button>

      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}

      {success && !error && (
        <p className="auth-success">
          {success}
        </p>
      )}

    </div>
  );
}

PasswordInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  success: PropTypes.string,
};

PasswordInput.defaultProps = {
  placeholder: "Password",
  value: "",
  onChange: () => {},
};