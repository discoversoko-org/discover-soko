/* User Validation Helpers
   Uses throw-based errors → handled by error.middleware
 */


/* 📌 Validate User Profile Update */
const validateUpdateUser = (data) => {
  const allowedFields = ["name", "email", "password"];

  const keys = Object.keys(data || {}).filter((key) =>
    allowedFields.includes(key)
  );

  if (keys.length === 0) {
    throw { status: 400, message: "No valid data provided for update" };
  }

  /* Validate name */
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || data.name.trim().length < 2) {
      throw { status: 400, message: "Name must be at least 2 characters" };
    }
  }

  /* Validate email */
  if (data.email !== undefined) {
    if (typeof data.email !== "string" || !data.email.includes("@")) {
      throw { status: 400, message: "Valid email is required" };
    }
  }

  /* Validate password (optional update) */
  if (data.password !== undefined) {
    if (typeof data.password !== "string" || data.password.length < 6) {
      throw { status: 400, message: "Password must be at least 6 characters" };
    }
  }
};


/* 📌 Validate User ID */
const validateUserId = (id) => {
  const mongoose = require("mongoose");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { status: 400, message: "Invalid user ID" };
  }
};

module.exports = {
  validateUpdateUser,
  validateUserId,
};