import { useRef } from "react";
import PropTypes from "prop-types";

import "../../styles/auth/otp.css";

export default function OTPInput({
  value = "",
  onChange = () => {},
  length = 4,
}) {
  const inputs = useRef([]);

  const values = value.split("");

  const handleChange = (digit, index) => {
    if (!/^\d?$/.test(digit)) return;

    const otp = [...values];
    otp[index] = digit;

    onChange(otp.join(""));

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !values[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);

    const nextIndex = Math.min(
      pasted.length,
      length - 1
    );

    inputs.current[nextIndex]?.focus();
  };

  return (
    <div className="otp-container">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          className={`otp-input ${
            values[index] ? "otp-filled" : ""
          }`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={values[index] || ""}
          onChange={(e) =>
            handleChange(
              e.target.value,
              index
            )
          }
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              index
            )
          }
          onFocus={(e) =>
            e.target.select()
          }
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

OTPInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  length: PropTypes.number,
};

OTPInput.defaultProps = {
  value: "",
  onChange: () => {},
  length: 4,
};