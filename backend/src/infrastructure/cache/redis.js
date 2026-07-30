// src/infrastructure/cache/redis.js

const Redis = require("ioredis");

const { env } = require("../../config");

const logger = require("../logger/logger");

const maxRedisRetries = env.isDevelopment ? 3 : 30;

let redisUnavailableLogged = false;
let redis = null;

/* =========================================
   REDIS CLIENT
========================================= */

if (!env.redisUrl) {
  logger.warn(
    "⚠️ REDIS_URL not configured. Redis-backed features are disabled."
  );

  module.exports = null;
  return;
}

redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,

  enableReadyCheck: true,

  lazyConnect: false,

  retryStrategy(retries) {
    if (retries > maxRedisRetries) {
      if (!redisUnavailableLogged) {
        logger.warn(
          "⚠️ Redis unavailable. Continuing without Redis-backed features."
        );

        redisUnavailableLogged = true;
      }

      return null;
    }

    return Math.min(retries * 200, 3000);
  },
});

/* =========================================
   REDIS EVENTS
========================================= */

redis.on("connect", () => {
  redisUnavailableLogged = false;

  logger.info("✅ Redis connected");
});

redis.on("ready", () => {
  logger.info("🚀 Redis ready");
});

redis.on("close", () => {
  logger.warn("⚠️ Redis connection closed");
});

redis.on("reconnecting", () => {
  logger.warn("🔄 Reconnecting to Redis...");
});

redis.on("error", (error) => {
  if (redisUnavailableLogged) return;

  logger.error(`❌ Redis error: ${error.message}`);
});

/* =========================================
   EXPORT
========================================= */

module.exports = redis;