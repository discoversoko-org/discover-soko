const mongoose = require(
  "mongoose"
);

/* =========================================
   UPDATE USER
========================================= */

const validateUpdateUser =
  (data) => {
    const allowedFields =
      [
        "name",
        "countryCode",
        "phoneNumber",
      ];

    const providedFields =
      Object.keys(
        data || {}
      );

    const hasValidField =
      providedFields.some(
        (field) =>
          allowedFields.includes(
            field
          )
      );

    if (
      !hasValidField
    ) {
      throw {
        status: 400,

        message:
          "No valid fields provided",
      };
    }

    /* =========================
       NAME
    ========================= */

    if (
      data.name !==
      undefined
    ) {
      if (
        typeof data.name !==
          "string" ||
        data.name.trim()
          .length < 2
      ) {
        throw {
          status: 400,

          message:
            "Name must be at least 2 characters",
        };
      }
    }

    /* =========================
       COUNTRY CODE
    ========================= */

    if (
      data.countryCode !==
      undefined
    ) {
      if (
        typeof data.countryCode !==
          "string" ||
        !data.countryCode.trim()
      ) {
        throw {
          status: 400,

          message:
            "Country code is required",
        };
      }
    }

    /* =========================
       PHONE NUMBER
    ========================= */

    if (
      data.phoneNumber !==
      undefined
    ) {
      if (
        typeof data.phoneNumber !==
          "string" ||
        data.phoneNumber
          .trim()
          .length < 7
      ) {
        throw {
          status: 400,

          message:
            "Valid phone number is required",
        };
      }
    }
  };

/* =========================================
   CHANGE PASSWORD
========================================= */

const validateChangePassword =
  ({
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (
      !currentPassword
    ) {
      throw {
        status: 400,

        message:
          "Current password is required",
      };
    }

    if (
      !newPassword ||
      newPassword.length < 8
    ) {
      throw {
        status: 400,

        message:
          "New password must be at least 8 characters",
      };
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      throw {
        status: 400,

        message:
          "Passwords do not match",
      };
    }
  };

/* =========================================
   VALIDATE USER ID
========================================= */

const validateUserId =
  (userId) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw {
        status: 400,

        message:
          "Invalid user ID",
      };
    }
  };

module.exports = {
  validateUpdateUser,

  validateChangePassword,

  validateUserId,
};