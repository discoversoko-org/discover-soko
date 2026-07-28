// src/middleware/notFound.middleware.js

const logger = require(
  "../infrastructure/logger/logger"
);

/* =========================================
   NOT FOUND MIDDLEWARE
========================================= */

const notFoundMiddleware = (
  req,
  res
) => {
  logger.warn({
    message: "Route not found",

    method: req.method,

    path: req.originalUrl,

    ip: req.ip,

    userAgent: req.get(
      "user-agent"
    ),
  });

  return res
    .status(404)
    .json({
      success: false,

      statusCode: 404,

      message:
        `Route not found: ${req.originalUrl}`,
    });
};

/* =========================================
   EXPORT
========================================= */

module.exports =
  notFoundMiddleware;