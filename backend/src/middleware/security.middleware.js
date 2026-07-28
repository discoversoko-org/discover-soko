// src/middleware/security.middleware.js

const helmet = require(
  "helmet"
);

const cors = require(
  "cors"
);

const hpp = require(
  "hpp"
);

const compression = require(
  "compression"
);

const cookieParser = require(
  "cookie-parser"
);

const sanitizeHtml = require(
  "sanitize-html"
);

const { env } = require(
  "../config"
);

const logger = require(
  "../infrastructure/logger/logger"
);

/* =========================================
   HELMET
========================================= */

const helmetMiddleware =
  helmet({
    crossOriginResourcePolicy:
      false,

    contentSecurityPolicy:
      env.isProduction
        ? undefined
        : false,
  });

/* =========================================
   CORS
========================================= */

const corsMiddleware =
  cors({
    origin: (
      origin,
      callback
    ) => {
      /*
        Allow:
        - Mobile apps
        - Postman
        - Server-to-server requests
      */

      if (!origin) {
        return callback(
          null,
          true
        );
      }

      /*
        Development:
        allow all origins
      */

      if (
        env.isDevelopment
      ) {
        return callback(
          null,
          true
        );
      }

      /*
        Production whitelist
      */

      if (
        env.corsOrigins?.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      logger.warn(
        `⚠️ Blocked CORS origin: ${origin}`
      );

      return callback(
        new Error(
          "Not allowed by CORS"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  });

/* =========================================
   MONGO SANITIZER
========================================= */

const sanitizeMongo = (
  object
) => {
  if (
    !object ||
    typeof object !==
      "object"
  ) {
    return object;
  }

  for (const key of Object.keys(
    object
  )) {
    /*
      Remove malicious operators
    */

    if (
      key.startsWith(
        "$"
      ) ||
      key.includes(".")
    ) {
      delete object[
        key
      ];

      continue;
    }

    const value =
      object[key];

    if (
      value &&
      typeof value ===
        "object"
    ) {
      sanitizeMongo(
        value
      );
    }
  }

  return object;
};

const mongoSanitizeMiddleware =
  (
    req,
    _res,
    next
  ) => {
    if (req.body) {
      sanitizeMongo(
        req.body
      );
    }

    if (req.params) {
      sanitizeMongo(
        req.params
      );
    }

    if (req.query) {
      sanitizeMongo(
        req.query
      );
    }

    next();
  };

/* =========================================
   XSS SANITIZER
========================================= */

const sanitizeObject = (
  object
) => {
  if (
    !object ||
    typeof object !==
      "object"
  ) {
    return object;
  }

  for (const key of Object.keys(
    object
  )) {
    const value =
      object[key];

    if (
      typeof value ===
      "string"
    ) {
      object[key] =
        sanitizeHtml(
          value,
          {
            allowedTags:
              [],

            allowedAttributes:
              {},
          }
        ).trim();
    } else if (
      value &&
      typeof value ===
        "object"
    ) {
      sanitizeObject(
        value
      );
    }
  }

  return object;
};

const xssMiddleware = (
  req,
  _res,
  next
) => {
  if (req.body) {
    sanitizeObject(
      req.body
    );
  }

  if (req.params) {
    sanitizeObject(
      req.params
    );
  }

  if (req.query) {
    sanitizeObject(
      req.query
    );
  }

  next();
};

/* =========================================
   HPP PROTECTION
========================================= */

const hppMiddleware =
  hpp();

/* =========================================
   COMPRESSION
========================================= */

const compressionMiddleware =
  compression();

/* =========================================
   COOKIE PARSER
========================================= */

const cookieMiddleware =
  cookieParser(
    env.cookieSecret
  );

/* =========================================
   SECURITY LOGGER
========================================= */

const securityLogger = (
  req,
  _res,
  next
) => {
  req.security = {
    ip:
      req.headers[
        "x-forwarded-for"
      ] || req.ip,

    userAgent:
      req.get(
        "user-agent"
      ),

    referer:
      req.get(
        "referer"
      ) || null,

    origin:
      req.get(
        "origin"
      ) || null,
  };

  logger.info({
    message:
      "Incoming request",

    method:
      req.method,

    path:
      req.originalUrl,

    ip:
      req.security.ip,
  });

  next();
};

/* =========================================
   SECURITY STACK
========================================= */

const securityMiddleware =
  [
    helmetMiddleware,

    corsMiddleware,

    compressionMiddleware,

    cookieMiddleware,

    mongoSanitizeMiddleware,

    xssMiddleware,

    hppMiddleware,

    securityLogger,
  ];

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  helmetMiddleware,

  corsMiddleware,

  mongoSanitizeMiddleware,

  xssMiddleware,

  hppMiddleware,

  compressionMiddleware,

  cookieMiddleware,

  securityLogger,

  securityMiddleware,
};