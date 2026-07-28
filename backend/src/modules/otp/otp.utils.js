// src/modules/otp/otp.utils.js

const crypto = require("crypto");

const {
  OTP_LENGTH,
} = require(
  "./otp.constants"
);

/* =========================================
   GENERATE OTP
========================================= */

const generateOTP = () => {
  const min = Math.pow(
    10,
    OTP_LENGTH - 1
  );

  const max =
    Math.pow(
      10,
      OTP_LENGTH
    ) - 1;

  return crypto
    .randomInt(min, max)
    .toString();
};

/* =========================================
   CALCULATE OTP EXPIRY
========================================= */

const getOTPExpiryTime =
  (minutes = 10) => {
    return new Date(
      Date.now() +
        minutes *
          60 *
          1000
    );
  };

/* =========================================
   MASK OTP DESTINATION
========================================= */

const maskDestination =
  (value = "") => {
    if (
      value.includes("@")
    ) {
      const [
        username,
        domain,
      ] = value.split("@");

      return `${username.slice(
        0,
        2
      )}****@${domain}`;
    }

    return `*******${value.slice(
      -3
    )}`;
  };

module.exports = {
  generateOTP,

  getOTPExpiryTime,

  maskDestination,
};