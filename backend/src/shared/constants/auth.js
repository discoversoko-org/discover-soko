// src/shared/constants/auth.js

/* =========================================
   AUTH MESSAGES
========================================= */

const AUTH_MESSAGES = {
  USER_NOT_FOUND: "Account does not exist.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  INVALID_CREDENTIALS: "Incorrect password.",
  OTP_SENT: "Verification code sent successfully.",
  OTP_VERIFIED: "Verification successful.",
  EMAIL_NOT_VERIFIED: "Please verify your email before continuing.",
  ACCOUNT_INACTIVE: "Your account has been suspended or is not available.",
  ACCOUNT_SUSPENDED: "Your account has been suspended.",
  INVALID_REFRESH_TOKEN: "Invalid refresh token.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successful.",
  PASSWORD_CHANGED_SUCCESS: "Password changed successfully.",
  EMAIL_UPDATED: "Email updated successfully.",
  PHONE_UPDATED: "Phone number updated successfully.",
  ACCOUNT_DELETED: "Account deleted successfully.",
  DELETE_BUSINESS_FIRST: "Delete your business before deleting your account.",
  TOO_MANY_ATTEMPTS: "Too many attempts. Please try again later.",
};

/* =========================================
   OTP PURPOSES
========================================= */

const OTP_PURPOSES = {
  LOGIN: "login",
  VERIFY_EMAIL: "verify_email",
  CHANGE_EMAIL: "change_email",
  FORGOT_PASSWORD: "forgot_password",
  REGISTRATION: "registration",
  CUSTOMER_SIGNUP: "customer_signup",
  BUSINESS_SIGNUP: "business_signup",
  EMAIL_LOGIN: "email_login",
  ADMIN_2FA: "admin_2fa",
  RESET_PASSWORD: "forgot_password",
  CHANGE_PASSWORD: "change_password",
};

const OTP_METHODS = {
  EMAIL: "email",
};

/* =========================================
   USER STATUS
========================================= */

const USER_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  DELETED: "deleted",
};

/* =========================================
   USER ROLES
========================================= */

const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
};

module.exports = {
  AUTH_MESSAGES,
  OTP_PURPOSES,
  OTP_METHODS,
  USER_STATUS,
  USER_ROLES,
};