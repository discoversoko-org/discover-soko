// src/modules/auth/auth.utils.js

const crypto = require("crypto");

/* =========================================
   NORMALIZE EMAIL
========================================= */

const normalizeEmail = (
  email = ""
) => {
  return email
    .trim()
    .toLowerCase();
};

/* =========================================
   NORMALIZE PHONE NUMBER
========================================= */

const normalizePhoneNumber = ({
  countryCode,
  phoneNumber,
}) => {
  const cleanCountryCode =
    countryCode
      ?.toString()
      .replace(/\s+/g, "")
      .replace("+", "");

  const cleanPhone =
    phoneNumber
      ?.toString()
      .replace(/\D/g, "");

  return `+${cleanCountryCode}${cleanPhone}`;
};

/* =========================================
   SANITIZE USER RESPONSE
========================================= */

const sanitizeUser = (
  user
) => {
  if (!user) {
    return null;
  }

  return {
    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,

    status: user.status,

    countryCode:
      user.countryCode,

    phoneNumber:
      user.phoneNumber,

    fullPhoneNumber:
      user.fullPhoneNumber,

    emailVerified:
      user.emailVerified,

    avatar:
      user.avatar || null,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
};

/* =========================================
   GENERATE RANDOM TOKEN
========================================= */

const generateRandomToken =
  (length = 64) => {
    return crypto
      .randomBytes(length)
      .toString("hex");
  };

/* =========================================
   GENERATE SESSION ID
========================================= */

const generateSessionId =
  () => {
    return crypto.randomUUID();
  };

/* =========================================
   EXTRACT DEVICE INFO
========================================= */

const extractDeviceInfo =
  ({
    userAgent,
    ipAddress,
  }) => {
    return {
      ipAddress:
        ipAddress || null,

      userAgent:
        userAgent || "Unknown Device",
    };
  };

/* =========================================
   MASK EMAIL
========================================= */

const maskEmail = (
  email
) => {
  if (!email) {
    return "";
  }

  const [
    username,
    domain,
  ] = email.split("@");

  if (!username || !domain) {
    return email;
  }

  const visiblePart =
    username.slice(0, 2);

  const hiddenPart =
    "*".repeat(
      Math.max(
        username.length - 2,
        1
      )
    );

  return `${visiblePart}${hiddenPart}@${domain}`;
};

/* =========================================
   MASK PHONE NUMBER
========================================= */

const maskPhoneNumber =
  (phone) => {
    if (!phone) {
      return "";
    }

    const visibleDigits =
      phone.slice(-3);

    return `*******${visibleDigits}`;
  };

/* =========================================
   CHECK PASSWORD STRENGTH
========================================= */

const isStrongPassword =
  (password) => {
    if (!password) {
      return false;
    }

    const hasUppercase =
      /[A-Z]/.test(password);

    const hasLowercase =
      /[a-z]/.test(password);

    const hasNumber =
      /[0-9]/.test(password);

    const hasSpecialChar =
      /[^A-Za-z0-9]/.test(
        password
      );

    return (
      password.length >= 8 &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

/* =========================================
   FORMAT AUTH RESPONSE
========================================= */

const formatAuthResponse =
  ({
    user,
    accessToken,
    refreshToken,
  }) => {
    return {
      user:
        sanitizeUser(user),

      accessToken,

      refreshToken,
    };
  };

module.exports = {
  normalizeEmail,

  normalizePhoneNumber,

  sanitizeUser,

  generateRandomToken,

  generateSessionId,

  extractDeviceInfo,

  maskEmail,

  maskPhoneNumber,

  isStrongPassword,

  formatAuthResponse,
};