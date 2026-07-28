// src/server.js

require("dotenv").config();

const http = require("http");

const app = require("./app");

const logger = require(
  "./infrastructure/logger/logger"
);

/* =========================================
   CONFIG
========================================= */

const PORT =
  Number(process.env.PORT) ||
  4000;

/* =========================================
   CREATE SERVER
========================================= */

const server =
  http.createServer(app);

/* =========================================
   SERVER TIMEOUTS
========================================= */

server.keepAliveTimeout =
  65000;

server.headersTimeout =
  66000;

/* =========================================
   GRACEFUL SHUTDOWN
========================================= */

const gracefulShutdown =
  (signal, code = 0) => {
    logger.warn(
      `⚠️ ${signal} RECEIVED`
    );

    server.close(() => {
      logger.info(
        "🛑 Server stopped gracefully"
      );

      process.exit(code);
    });

    setTimeout(() => {
      logger.error(
        "❌ Forced shutdown"
      );

      process.exit(1);
    }, 10000);
  };

/* =========================================
   START SERVER
========================================= */

server.listen(PORT, () => {
  logger.info(
    `🚀 Server running on port ${PORT}`
  );

  logger.info(
    `🌍 Environment: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );
});

/* =========================================
   SERVER ERRORS
========================================= */

server.on(
  "error",
  (error) => {
    if (
      error.code ===
      "EADDRINUSE"
    ) {
      logger.error(
        `❌ Port ${PORT} is already in use`
      );

      process.exit(1);
    }

    logger.error(
      "❌ SERVER ERROR"
    );

    logger.error(error);

    process.exit(1);
  }
);

/* =========================================
   PROCESS ERRORS
========================================= */

process.on(
  "unhandledRejection",
  (reason) => {
    logger.error(
      "❌ UNHANDLED REJECTION"
    );

    logger.error(reason);

    gracefulShutdown(
      "UNHANDLED_REJECTION",
      1
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    logger.error(
      "❌ UNCAUGHT EXCEPTION"
    );

    logger.error(error);

    gracefulShutdown(
      "UNCAUGHT_EXCEPTION",
      1
    );
  }
);

/* =========================================
   TERMINATION SIGNALS
========================================= */

process.on(
  "SIGINT",
  () =>
    gracefulShutdown(
      "SIGINT"
    )
);

process.on(
  "SIGTERM",
  () =>
    gracefulShutdown(
      "SIGTERM"
    )
);