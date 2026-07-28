// src/shared/constants/security.js

module.exports = {
  BCRYPT_ROUNDS: 12,

  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,

  USERNAME_REGEX:
    /^[a-z0-9._]+$/,

  PHONE_REGEX:
    /^[0-9]{6,15}$/,

  DEVICE_TYPES: [
    "mobile",
    "tablet",
    "desktop",
    "bot",
    "unknown",
  ],

  ACCOUNT_STATUS: [
    "pending",
    "active",
    "inactive",
    "suspended",
    "deleted",
  ],

  OTP_PURPOSES: [
    "customer_signup",
    "business_signup",
    "email_login",
    "admin_2fa",
    "forgot_password",
    "verify_email",
    "2fa",
  ],
};