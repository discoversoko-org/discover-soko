// src/modules/security/rateLimit.service.js

const redis = require(
  "../../infrastructure/redis"
);

/* =========================================
   CREATE RATE LIMIT
========================================= */

const checkRateLimit =
  async ({
    key,
    limit = 10,
    window = 60,
  }) => {
    const redisKey =
      `rate:${key}`;

    const current =
      await redis.incr(
        redisKey
      );

    if (current === 1) {
      await redis.expire(
        redisKey,
        window
      );
    }

    return {
      allowed:
        current <= limit,

      current,

      remaining:
        limit - current,
    };
  };

/* =========================================
   RESET RATE LIMIT
========================================= */

const resetRateLimit =
  async (key) => {
    return redis.del(
      `rate:${key}`
    );
  };

module.exports = {
  checkRateLimit,
  resetRateLimit,
};