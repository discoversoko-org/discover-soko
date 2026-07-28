// src/modules/auth/auth.validation.js

const validator = require("validator");

const ApiError = require("../../shared/utils/ApiError");
const { ROLES } = require("../../shared/constants/roles");

const throwValidationError = (message) => {
  throw new ApiError(400, message || "Validation failed");
};

const validateRequiredString = (value, fieldName) => {
  if (typeof value !== "string" || !value.trim()) {
    throwValidationError(`${fieldName} is required`);
  }

  return value.trim();
};

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const normalizePhone = (phone = "") => String(phone).replace(/\D/g, "");

const validateEmail = (input) => {
  const value = typeof input === "object" ? input?.email : input;
  const email = normalizeEmail(value);

  validateRequiredString(email, "Email");

  if (!validator.isEmail(email)) {
    throwValidationError("Invalid email address");
  }

  return email;
};

const validateOTP = ({ email, code }) => {
  validateEmail(email);

  if (code === undefined || code === null) {
    throwValidationError("Verification code is required");
  }

  const otp = String(code).trim();

  if (!/^\d{4}$/.test(otp)) {
    throwValidationError("OTP must be 4 digits");
  }

  return true;
};

const validatePasswordStrength = (password) => {
  validateRequiredString(password, "Password");

  if (password.length < 8) {
    throwValidationError("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&.#_-]/.test(password)) {
    throwValidationError("Password must contain uppercase, lowercase, number and special character");
  }

  return true;
};

const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throwValidationError("Passwords do not match");
  }

  return true;
};

const validatePhoneNumber = ({ countryCode, phoneNumber }) => {
  validateRequiredString(countryCode, "Country code");
  validateRequiredString(phoneNumber, "Phone number");

  const cleanCountryCode = countryCode.replace(/\s+/g, "");
  const cleanPhoneNumber = normalizePhone(phoneNumber);

  if (!/^\+\d{1,4}$/.test(cleanCountryCode)) {
    throwValidationError("Invalid country code");
  }

  if (!/^\d{7,15}$/.test(cleanPhoneNumber)) {
    throwValidationError("Invalid phone number");
  }

  return {
    countryCode: cleanCountryCode,
    phoneNumber: cleanPhoneNumber,
    fullPhone: `${cleanCountryCode}${cleanPhoneNumber}`,
  };
};

const validateCustomerProfileCompletion = ({ firstName, lastName, countryCode, phoneNumber, password }) => {
  validateRequiredString(firstName, "First name");
  validatePhoneNumber({ countryCode, phoneNumber });
  validateRequiredString(password, "Password");

  return true;
};

const validateRegistrationCompletion = ({ firstName, lastName, countryCode, phoneNumber, password }) => {
  return validateCustomerProfileCompletion({ firstName, lastName, countryCode, phoneNumber, password });
};

const validateBusinessCompletion = ({ firstName, lastName, password, confirmPassword, acceptedPrivacyPolicy }) => {
  validateRequiredString(firstName, "First name");

  validatePasswordStrength(password);
  validatePasswordMatch(password, confirmPassword);

  if (acceptedPrivacyPolicy !== true) {
    throwValidationError("Privacy policy must be accepted");
  }

  return true;
};

const validateAdminLogin = ({ email, password }) => {
  validateEmail(email);
  validateRequiredString(password, "Password");
  return true;
};

const validateLogin = ({ email, password }) => {
  validateEmail(email);
  validateRequiredString(password, "Password");
  return true;
};

const validateResetPassword = ({ newPassword, confirmPassword }) => {
  validatePasswordStrength(newPassword);
  validatePasswordMatch(newPassword, confirmPassword);
  return true;
};

const validateChangePassword = ({ currentPassword, newPassword, confirmPassword }) => {
  validateRequiredString(currentPassword, "Current password");
  validatePasswordStrength(newPassword);
  validatePasswordMatch(newPassword, confirmPassword);

  if (currentPassword === newPassword) {
    throwValidationError("New password must be different from current password");
  }

  return true;
};

const validateRole = (role) => {
  validateRequiredString(role, "Role");

  const allowedRoles = [ROLES.CUSTOMER, ROLES.ADMIN];
  if (!allowedRoles.includes(role)) {
    throwValidationError("Invalid role");
  }

  return true;
};

module.exports = {
  validateEmail,
  validateOTP,
  validatePhoneNumber,
  validateCustomerProfileCompletion,
  validateRegistrationCompletion,
  validateBusinessCompletion,
  validateAdminLogin,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateRole,
};
