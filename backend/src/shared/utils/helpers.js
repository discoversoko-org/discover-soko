// src/shared/utils/helpers.js

const crypto = require(
  "crypto"
);

/* =========================================
   STRING HELPERS
========================================= */

const slugify = (
  text = ""
) => {
  return text
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /(^-|-$)+/g,
      ""
    );
};

const capitalize = (
  text = ""
) => {
  return (
    text.charAt(0)
      .toUpperCase() +
    text.slice(1)
  );
};

const maskEmail = (
  email = ""
) => {
  const [
    username,
    domain,
  ] = email.split("@");

  if (
    !username ||
    !domain
  ) {
    return email;
  }

  const masked =
    username.slice(0, 2) +
    "***";

  return `${masked}@${domain}`;
};

const maskPhone = (
  phone = ""
) => {
  if (
    phone.length < 4
  ) {
    return phone;
  }

  return (
    "*".repeat(
      phone.length - 4
    ) +
    phone.slice(-4)
  );
};

/* =========================================
   RANDOM GENERATORS
========================================= */

const generateRandomString =
  (
    length = 32
  ) => {
    return crypto
      .randomBytes(length)
      .toString("hex");
  };

const generateNumericCode =
  (
    length = 6
  ) => {
    let code = "";

    for (
      let i = 0;
      i < length;
      i++
    ) {
      code += Math.floor(
        Math.random() * 10
      );
    }

    return code;
  };

/* =========================================
   OBJECT HELPERS
========================================= */

const removeUndefined =
  (obj = {}) => {
    return Object.fromEntries(
      Object.entries(
        obj
      ).filter(
        ([, value]) =>
          value !==
          undefined
      )
    );
  };

const pick = (
  obj = {},
  fields = []
) => {
  return fields.reduce(
    (
      acc,
      field
    ) => {
      if (
        Object.prototype.hasOwnProperty.call(
          obj,
          field
        )
      ) {
        acc[field] =
          obj[field];
      }

      return acc;
    },
    {}
  );
};

/* =========================================
   PAGINATION
========================================= */

const getPagination = (
  page = 1,
  limit = 10
) => {
  const currentPage =
    Number(page) || 1;

  const currentLimit =
    Number(limit) || 10;

  const skip =
    (currentPage - 1) *
    currentLimit;

  return {
    page: currentPage,
    limit:
      currentLimit,
    skip,
  };
};

module.exports = {
  slugify,
  capitalize,
  maskEmail,
  maskPhone,
  generateRandomString,
  generateNumericCode,
  removeUndefined,
  pick,
  getPagination,
};