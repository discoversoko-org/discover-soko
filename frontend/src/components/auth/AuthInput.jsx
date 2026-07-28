import { useState } from "react";
import PropTypes from "prop-types";

import "../../styles/auth/inputs.css";

export default function AuthInput({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="auth-input-group">
      <input
        className={`auth-input
          ${focused ? "input-focused" : ""}
          ${value ? "input-filled" : ""}
          ${error ? "input-error" : ""}
          ${success ? "input-success" : ""}
        `}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

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

AuthInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  success: PropTypes.string,
  autoFocus: PropTypes.bool,
};