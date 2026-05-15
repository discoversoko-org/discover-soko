/* Auth Validation Helpers
 * Uses throw-based errors → handled by error.middleware
 */

/* 📌 Validate Register */
const validateRegister = ({ name, email, password }) => {
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw { status: 400, message: "Name must be at least 2 characters" };
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw { status: 400, message: "Valid email is required" };
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters" };
  }
};

module.exports = {
  validateRegister,
};