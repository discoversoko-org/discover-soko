// src/app.js

require("dotenv").config();

const express = require(
  "express"
);

const cors = require(
  "cors"
);

const compression = require(
  "compression"
);

const cookieParser = require(
  "cookie-parser"
);

/* =========================================
   DATABASE
========================================= */

const connectDB = require(
  "./infrastructure/database/mongodb"
);

/* =========================================
   LOGGER
========================================= */

const logger = require(
  "./infrastructure/logger/logger"
);

const env = require(
  "./config/env"
);

/* =========================================
   SECURITY
========================================= */

const {
  securityMiddleware,
} = require(
  "./middleware/security.middleware"
);

/* =========================================
   RATE LIMITER
========================================= */

const {
  globalLimiter,
} = require(
  "./middleware/ratelimit.middleware"
);

/* =========================================
   ROUTES
========================================= */

const authRoutes = require(
  "./modules/auth/auth.routes"
);

const userRoutes = require(
  "./modules/user/user.routes"
);

/* =========================================
   MIDDLEWARE
========================================= */

const notFoundMiddleware =
  require(
    "./middleware/notFound.middleware"
  );

const errorMiddleware =
  require(
    "./middleware/error.middleware"
  );

/* =========================================
   BACKGROUND JOBS
========================================= */

require(
  "./jobs/cleanupExpiredOtps.job"
);

require(
  "./jobs/cleanupSessions.job"
);

require(
  "./jobs/deleteUnverifiedUsers.job"
);

/* =========================================
   CREATE APP
========================================= */

const app = express();

/* =========================================
   DATABASE CONNECTION
========================================= */

connectDB();

/* =========================================
   TRUST PROXY
========================================= */

app.set(
  "trust proxy",
  1
);

/* =========================================
   CORS
========================================= */

const localhostRegex =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const allowedOrigins =
  new Set(
    env.clientUrls
  );

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      const isNoOrigin =
        !origin;

      const isExplicitlyAllowed =
        origin &&
        allowedOrigins.has(
          origin
        );

      const isDevLocalhost =
        env.isDevelopment &&
        origin &&
        localhostRegex.test(
          origin
        );

      if (
        isNoOrigin ||
        isExplicitlyAllowed ||
        isDevLocalhost
      ) {
        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          "CORS not allowed"
        )
      );
    },

    credentials: true,
  })
);

/* =========================================
   PARSERS
========================================= */

app.use(compression());

app.use(cookieParser());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =========================================
   SECURITY
========================================= */

app.use(
  securityMiddleware
);

/* =========================================
   RATE LIMITING
========================================= */

app.use(
  "/api",
  globalLimiter
);

/* =========================================
   REQUEST LOGGER
========================================= */

app.use(
  (
    req,
    res,
    next
  ) => {
    logger.info({
      method:
        req.method,

      path:
        req.originalUrl,

      ip: req.ip,

      userAgent:
        req.get(
          "user-agent"
        ),
    });

    next();
  }
);

/* =========================================
   ROOT ROUTE
========================================= */

app.get(
  "/",
  (
    req,
    res
  ) => {
    return res
      .status(200)
      .json({
        success: true,

        message:
          "Production API running",

        version:
          "1.0.0",

        environment:
          process.env
            .NODE_ENV,

        timestamp:
          new Date().toISOString(),
      });
  }
);

/* =========================================
   HEALTH CHECK
========================================= */

app.get(
  "/health",
  (
    req,
    res
  ) => {
    return res
      .status(200)
      .json({
        success: true,

        message:
          "Server is healthy",

        uptime:
          process.uptime(),

        environment:
          process.env
            .NODE_ENV,

        timestamp:
          new Date().toISOString(),
      });
  }
);

/* =========================================
   API ROUTES
========================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

/* =========================================
   404 HANDLER
========================================= */

app.use(
  notFoundMiddleware
);

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use(
  errorMiddleware
);

/* =========================================
   PROCESS ERRORS
========================================= */

process.on(
  "unhandledRejection",
  (error) => {
    logger.error({
      type:
        "UnhandledRejection",

      message:
        error.message,

      stack:
        error.stack,
    });
  }
);

process.on(
  "uncaughtException",
  (error) => {
    logger.error({
      type:
        "UncaughtException",

      message:
        error.message,

      stack:
        error.stack,
    });

    process.exit(1);
  }
);

module.exports = app;