// src/modules/security/sanitize.service.js

/* =========================================
   REMOVE HTML TAGS
========================================= */

const sanitizeString =
  (value = "") => {
    return value
      .replace(
        /<[^>]*>?/gm,
        ""
      )
      .trim();
  };

/* =========================================
   SANITIZE OBJECT
========================================= */

const sanitizeObject =
  (data = {}) => {
    const sanitized =
      {};

    for (const key in data) {
      const value =
        data[key];

      if (
        typeof value ===
        "string"
      ) {
        sanitized[key] =
          sanitizeString(
            value
          );
      } else {
        sanitized[key] =
          value;
      }
    }

    return sanitized;
  };

/* =========================================
   REMOVE MONGO OPERATORS
========================================= */

const removeMongoOperators =
  (obj = {}) => {
    const clean = {};

    for (const key in obj) {
      if (
        key.startsWith(
          "$"
        ) ||
        key.includes(".")
      ) {
        continue;
      }

      clean[key] =
        obj[key];
    }

    return clean;
  };

module.exports = {
  sanitizeString,
  sanitizeObject,
  removeMongoOperators,
};