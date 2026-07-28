// src/infrastructure/logger/logger.js

const fs = require(
  "fs"
);

const path = require(
  "path"
);

const winston = require(
  "winston"
);

const { env } = require(
  "../../config"
);

/* =========================================
   LOG DIRECTORY
========================================= */

const logsDir = path.join(
  process.cwd(),
  "logs"
);

if (
  !fs.existsSync(logsDir)
) {
  fs.mkdirSync(
    logsDir,
    {
      recursive: true,
    }
  );
}

/* =========================================
   LOG FORMAT
========================================= */

const logFormat =
  winston.format.printf(
    ({
      level,
      message,
      timestamp,
      stack,
    }) =>
      stack
        ? `${timestamp} [${level}] ${stack}`
        : `${timestamp} [${level}] ${message}`
  );

/* =========================================
   LOGGER
========================================= */

const logger =
  winston.createLogger({
    level:
      process.env
        .LOG_LEVEL ||
      "info",

    defaultMeta: {
      service:
        "auth-backend",
    },

    format:
      winston.format.combine(
        winston.format.timestamp(),

        winston.format.errors(
          {
            stack:
              true,
          }
        ),

        env.isDevelopment
          ? winston.format.colorize()
          : winston.format.uncolorize(),

        logFormat
      ),

    transports: [
      /* =========================================
         CONSOLE
      ========================================= */

      new winston.transports.Console(),

      /* =========================================
         ERROR LOGS
      ========================================= */

      new winston.transports.File(
        {
          filename:
            path.join(
              logsDir,
              "error.log"
            ),

          level:
            "error",
        }
      ),

      /* =========================================
         COMBINED LOGS
      ========================================= */

      new winston.transports.File(
        {
          filename:
            path.join(
              logsDir,
              "combined.log"
            ),
        }
      ),
    ],

    exceptionHandlers: [
      new winston.transports.File(
        {
          filename:
            path.join(
              logsDir,
              "exceptions.log"
            ),
        }
      ),
    ],

    rejectionHandlers: [
      new winston.transports.File(
        {
          filename:
            path.join(
              logsDir,
              "rejections.log"
            ),
        }
      ),
    ],
  });

/* =========================================
   EXPORT
========================================= */

module.exports =
  logger;