// src/infrastructure/database/mongodb.js

const mongoose = require(
  "mongoose"
);

const { env } = require(
  "../../config"
);

const logger = require(
  "../logger/logger"
);

/* =========================================
   MONGOOSE CONFIG
========================================= */

mongoose.set(
  "strictQuery",
  true
);

/* =========================================
   DATABASE CONNECTION
========================================= */

const connectDatabase =
  async () => {
    try {
      if (!env.mongoUri) {
        throw new Error(
          "MONGO_URI is missing"
        );
      }

      const connection =
        await mongoose.connect(
          env.mongoUri,
          {
            autoIndex:
              env.isDevelopment,

            maxPoolSize: 20,

            minPoolSize: 5,

            serverSelectionTimeoutMS:
              5000,

            socketTimeoutMS:
              45000,

            family: 4,
          }
        );

      logger.info(
        `✅ MongoDB connected: ${connection.connection.host}`
      );

      /* =========================================
         CONNECTION EVENTS
      ========================================= */

      mongoose.connection.on(
        "disconnected",
        () => {
          logger.warn(
            "⚠️ MongoDB disconnected"
          );
        }
      );

      mongoose.connection.on(
        "reconnected",
        () => {
          logger.info(
            "🔄 MongoDB reconnected"
          );
        }
      );

      mongoose.connection.on(
        "error",
        (error) => {
          logger.error(
            `❌ MongoDB error: ${error.message}`
          );
        }
      );
    } catch (error) {
      logger.error(
        `❌ MongoDB connection failed: ${error.message}`
      );

      process.exit(1);
    }
  };

/* =========================================
   GRACEFUL SHUTDOWN
========================================= */

process.on(
  "SIGINT",
  async () => {
    await mongoose.connection.close();

    logger.info(
      "🛑 MongoDB connection closed"
    );

    process.exit(0);
  }
);

/* =========================================
   EXPORT
========================================= */

module.exports =
  connectDatabase;