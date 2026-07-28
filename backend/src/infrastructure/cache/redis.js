// src/infrastructure/cache/redis.js

const Redis = require(
  "ioredis"
);

const { env } = require(
  "../../config"
);

const logger = require(
  "../logger/logger"
);

const maxRedisRetries =
  env.isDevelopment ? 3 : 30;

let redisUnavailableLogged =
  false;

/* =========================================
   REDIS CLIENT
========================================= */

const redis = new Redis(
  env.redisUrl,
  {
    maxRetriesPerRequest:
      null,

    enableReadyCheck:
      false,

    retryStrategy(
      retries
    ) {
      if (
        retries >
        maxRedisRetries
      ) {
        if (
          !redisUnavailableLogged
        ) {
          logger.warn(
            "⚠️ Redis unavailable. Continuing without Redis-backed features in development."
          );
          redisUnavailableLogged =
            true;
        }
        return null;
      }

      return Math.min(
        retries * 100,
        3000
      );
    },
  }
);

/* =========================================
   REDIS EVENTS
========================================= */

redis.on(
  "connect",
  () => {
    redisUnavailableLogged =
      false;
    logger.info(
      "✅ Redis connected"
    );
  }
);

redis.on(
  "ready",
  () => {
    logger.info(
      "🚀 Redis ready"
    );
  }
);

redis.on(
  "close",
  () => {
    logger.warn(
      "⚠️ Redis connection closed"
    );
  }
);

redis.on(
  "error",
  (error) => {
    if (redisUnavailableLogged) {
      return;
    }
    logger.error(
      `❌ Redis error: ${error.message}`
    );
  }
);

/* =========================================
   EXPORT
========================================= */

module.exports =
  redis;