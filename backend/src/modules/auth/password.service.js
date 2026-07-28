// src/modules/auth/password.service.js

const bcrypt = require("bcryptjs");

/* =========================================
   HASH PASSWORD
========================================= */

const hashPassword =
  async (password) => {
    const saltRounds = 12;

    return bcrypt.hash(
      password,
      saltRounds
    );
  };

/* =========================================
   COMPARE PASSWORD
========================================= */

const comparePassword =
  async ({
    password,
    hashedPassword,
  }) => {
    return bcrypt.compare(
      password,
      hashedPassword
    );
  };

/* =========================================
   VALIDATE PASSWORD STRENGTH
========================================= */

const validatePasswordStrength =
  (password) => {
    const errors = [];

    if (
      password.length < 8
    ) {
      errors.push(
        "Password must be at least 8 characters"
      );
    }

    if (
      !/[A-Z]/.test(password)
    ) {
      errors.push(
        "Password must contain an uppercase letter"
      );
    }

    if (
      !/[a-z]/.test(password)
    ) {
      errors.push(
        "Password must contain a lowercase letter"
      );
    }

    if (
      !/[0-9]/.test(password)
    ) {
      errors.push(
        "Password must contain a number"
      );
    }

    if (
      !/[^A-Za-z0-9]/.test(
        password
      )
    ) {
      errors.push(
        "Password must contain a special character"
      );
    }

    return {
      isValid:
        errors.length === 0,

      errors,
    };
  };

/* =========================================
   CHECK PASSWORD MATCH
========================================= */

const ensurePasswordsMatch =
  ({
    password,
    confirmPassword,
  }) => {
    if (
      password !==
      confirmPassword
    ) {
      throw {
        status: 400,

        message:
          "Passwords do not match",
      };
    }
  };

module.exports = {
  hashPassword,

  comparePassword,

  validatePasswordStrength,

  ensurePasswordsMatch,
};