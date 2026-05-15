module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Server Error";

  /* =========================
     🔐 AUTH / JWT ERRORS
  ========================= */
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }

  /* =========================
     🗄️ MONGODB / MONGOOSE ERRORS
  ========================= */
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    status = 400;

    // Extract duplicate field safely
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists`
      : "Duplicate field value";
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  /* =========================
     📤 FILE UPLOAD (MULTER)
  ========================= */
  if (err instanceof Error && err.message.includes("files are allowed")) {
    status = 400;
    message = err.message;
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 400;
    message = "File too large";
  }

  /* =========================
     ⚙️ CUSTOM APP ERRORS
  ========================= */
  if (typeof err === "string") {
    message = err;
  }

  if (err.isOperational === false) {
    message = "Unexpected server error";
  }

  /* =========================
     🪵 LOGGING (DEV ONLY)
  ========================= */
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ ERROR STACK:", err);
  }

  /* =========================
     📤 RESPONSE
  ========================= */
  res.status(status).json({
    success: false,
    message,
  });
};