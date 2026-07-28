// src/middleware/error.middleware.js

const mongoose = require(
  "mongoose"
);

const logger = require(
  "../infrastructure/logger/logger"
);

const { env } = require(
  "../config"
);

/* =========================================
   GLOBAL ERROR MIDDLEWARE
========================================= */

const errorMiddleware = (
  err,
  req,
  res,
  _next
) => {
  let statusCode =
    err.statusCode ||
    err.status ||
    500;

  let message =
    err.message ||
    "Internal server error";

  let errors = null;

  /* =========================================
     MONGOOSE VALIDATION ERROR
  ========================================= */

  if (
    err instanceof
    mongoose.Error.ValidationError
  ) {
    statusCode = 400;

    message =
      "Validation failed";

    errors =
      Object.values(
        err.errors
      ).map(
        (item) =>
          item.message
      );
  }

  /* =========================================
     DUPLICATE KEY ERROR
  ========================================= */

  if (
    err.code === 11000
  ) {
    statusCode = 409;

    const field =
      Object.keys(
        err.keyValue
      )[0];

    message = `${field} already exists`;
  }

  /* =========================================
     INVALID OBJECT ID
  ========================================= */

  if (
    err instanceof
    mongoose.Error.CastError
  ) {
    statusCode = 400;

    message =
      "Invalid resource ID";
  }

  /* =========================================
     JWT ERRORS
  ========================================= */

  if (
    err.name ===
    "JsonWebTokenError"
  ) {
    statusCode = 401;

    message =
      "Invalid token";
  }

  if (
    err.name ===
    "TokenExpiredError"
  ) {
    statusCode = 401;

    message =
      "Token expired";
  }

  /* =========================================
     MULTER ERRORS
  ========================================= */

  if (
    err.name ===
    "MulterError"
  ) {
    statusCode = 400;

    message =
      err.message;
  }

  /* =========================================
     INVALID JSON PAYLOAD
  ========================================= */

  if (
    err instanceof
      SyntaxError &&
    err.status ===
      400 &&
    "body" in err
  ) {
    statusCode = 400;

    message =
      "Invalid JSON payload";
  }

  /* =========================================
     REDIS ERRORS
  ========================================= */

  if (
    err.name ===
      "RedisError" ||
    err.code ===
      "ECONNREFUSED"
  ) {
    statusCode = 503;

    message =
      "Cache service unavailable";
  }

  /* =========================================
     CLOUDINARY ERRORS
  ========================================= */

  if (
    err.http_code
  ) {
    statusCode =
      err.http_code;

    message =
      err.message ||
      "Cloudinary upload failed";
  }

  /* =========================================
     FALLBACK STATUS
  ========================================= */

  if (
    !statusCode ||
    statusCode < 100
  ) {
    statusCode = 500;
  }

  /* =========================================
     ERROR LOGGING
  ========================================= */

  logger.error({
    message,

    statusCode,

    method:
      req.method,

    path:
      req.originalUrl,

    ip:
      req.ip,

    userAgent:
      req.get(
        "user-agent"
      ),

    requestBody:
      req.body,

    params:
      req.params,

    query:
      req.query,

    stack:
      err.stack,
  });

  /* =========================================
     ERROR RESPONSE
  ========================================= */

  return res
    .status(
      statusCode
    )
    .json({
      success: false,

      statusCode,

      message,

      ...(errors && {
        errors,
      }),

      ...(env.isDevelopment && {
        stack:
          err.stack,

        rawError:
          err,
      }),
    });
};

/* =========================================
   EXPORT
========================================= */

module.exports =
  errorMiddleware;