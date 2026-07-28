import PropTypes from "prop-types";

import { COUNTRIES } from "../../constants/countries";

import "../../styles/auth/inputs.css";

export default function CountryCodePicker({
  value = "+254",
  onChange = () => {},
}) {
  return (
    <select
      className="country-code-picker"
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
    >
      {COUNTRIES.map((country) => (
        <option
          key={country.code}
          value={country.dialCode}
        >
          {country.flag} {country.dialCode}
        </option>
      ))}
    </select>
  );
}

CountryCodePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

CountryCodePicker.defaultProps = {
  value: "+254",
  onChange: () => {},
};