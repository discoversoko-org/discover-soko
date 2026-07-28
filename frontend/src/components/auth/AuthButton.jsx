import PropTypes from "prop-types";
import "../../styles/auth/buttons.css";

export default function AuthButton({
  children,
  text,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className="auth-button"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : (children || text)}
    </button>
  );
}

AuthButton.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};