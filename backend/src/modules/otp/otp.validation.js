// src/modules/otp/otp.validation.js

const {
  OTP_LENGTH,
  OTP_PURPOSES,
  OTP_METHODS,
} = require(
  "./otp.constants"
);

/* =========================================
   VALIDATE OTP PAYLOAD
========================================= */

const validateOTPInput =
  ({
    code,
    purpose,
    method,
  }) => {
    if (!code) {
      throw {
        status: 400,

        message:
          "OTP code is required",
      };
    }

    if (
      code.toString()
        .length !==
      OTP_LENGTH
    ) {
      throw {
        status: 400,

        message: `OTP must be ${OTP_LENGTH} digits`,
      };
    }

    if (
      purpose &&
      !Object.values(
        OTP_PURPOSES
      ).includes(purpose)
    ) {
      throw {
        status: 400,

        message:
          "Invalid OTP purpose",
      };
    }

    if (
      method &&
      !Object.values(
        OTP_METHODS
      ).includes(method)
    ) {
      throw {
        status: 400,

        message:
          "Invalid OTP method",
      };
    }
  };

module.exports = {
  validateOTPInput,
};