// src/components/auth/PhoneInput.jsx

import PropTypes from "prop-types";

import CountryCodePicker from "./CountryCodePicker";
import { COUNTRIES } from "../../constants/countries";

import "../../styles/auth/inputs.css";

export default function PhoneInput({
  countryCode = COUNTRIES[0].dialCode,
  phone = "",
  onCountryChange = () => {},
  onPhoneChange = () => {},
  error,
}) {
  return (
    <div className="auth-input-group">
      <div
        className={`phone-input-wrapper ${
          phone ? "input-filled" : ""
        }`}
      >
        <CountryCodePicker
          value={countryCode}
          onChange={onCountryChange}
        />

        <input
          type="tel"
          className={`phone-input ${
            phone ? "input-filled" : ""
          }`}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            onPhoneChange(e.target.value)
          }
        />
      </div>

      {error && (
        <p className="auth-error">
          {error}
        </p>
      )}
    </div>
  );
}

PhoneInput.propTypes = {
  countryCode: PropTypes.string,
  phone: PropTypes.string,
  onCountryChange: PropTypes.func,
  onPhoneChange: PropTypes.func,
  error: PropTypes.string,
};