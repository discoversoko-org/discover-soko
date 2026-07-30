import PropTypes from "prop-types";

import Check from "../../assets/logos/check.svg";

import "../../styles/auth/success.css";

export default function SuccessSheet({
  open,
  title = "Success",
  message,
  buttonText = "Browse Home",
  onContinue,
}) {
  if (!open) return null;

  return (
    <div className="sheet-overlay">

      <div className="success-sheet">

        <div className="success-icon-wrapper">
          <img
            src={Check}
            alt="Success"
            className="success-icon"
          />
        </div>

        <h2 className="success-title">
          {title}
        </h2>

        <p className="success-message">
          {message}
        </p>

        <button
          type="button"
          className="auth-button success-button"
          onClick={onContinue}
        >
          {buttonText}
        </button>

      </div>

    </div>
  );
}

SuccessSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onContinue: PropTypes.func.isRequired,
};