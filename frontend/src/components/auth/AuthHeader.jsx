import PropTypes from "prop-types";
import "../../styles/auth/forms.css";

export default function AuthHeader({
  title,
  subtitle,
}) {
  return (
    <div className="auth-header">
      <h1 className="auth-title">
        {title}
      </h1>

      {subtitle && (
        <p className="auth-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}

AuthHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};