// src/shared/utils/phone.util.js

/* =========================================
   CONSTANTS
========================================= */

const COUNTRY_CODE =
  "254";

const PHONE_REGEX =
  /^\+2547\d{8}$/;

/* =========================================
   NORMALIZE PHONE
========================================= */

const normalizePhoneNumber = (
  phone = ""
) => {
  let cleaned =
    String(phone).replace(
      /\D/g,
      ""
    );

  /* =====================================
     REMOVE LEADING ZERO
  ===================================== */

  if (
    cleaned.startsWith("0")
  ) {
    cleaned =
      cleaned.slice(1);
  }

  /* =====================================
     ENSURE COUNTRY CODE
  ===================================== */

  if (
    !cleaned.startsWith(
      COUNTRY_CODE
    )
  ) {
    cleaned = `${COUNTRY_CODE}${cleaned}`;
  }

  return `+${cleaned}`;
};

/* =========================================
   VALIDATE PHONE
========================================= */

const validatePhoneNumber = (
  phone = ""
) =>
  PHONE_REGEX.test(
    normalizePhoneNumber(
      phone
    )
  );

module.exports = {
  normalizePhoneNumber,
  validatePhoneNumber,
};