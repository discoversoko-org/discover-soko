// src/modules/security/fraud.service.js

const redis = require(
  "../../infrastructure/cache/redis"
);

/* =========================================
   CONSTANTS
========================================= */

const MAX_FAILED_ATTEMPTS = 5;

const LOCK_TIME =
  15 * 60; // seconds

/* =========================================
   HELPERS
========================================= */

const getKey = (
  identifier
) => {
  return `fraud:${identifier}`;
};

/* =========================================
   TRACK FAILED ATTEMPTS
========================================= */

const trackFailedAttempt =
  async (
    identifier
  ) => {
    try {
      const key =
        getKey(identifier);

      const attempts =
        await redis.incr(
          key
        );

      if (attempts === 1) {
        await redis.expire(
          key,
          LOCK_TIME
        );
      }

      return {
        attempts,

        remaining:
          Math.max(
            0,
            MAX_FAILED_ATTEMPTS -
              attempts
          ),

        blocked:
          attempts >=
          MAX_FAILED_ATTEMPTS,
      };
    } catch (error) {
      console.error(
        "Fraud tracking error:",
        error.message
      );

      return {
        attempts: 0,
        remaining:
          MAX_FAILED_ATTEMPTS,
        blocked: false,
      };
    }
  };

/* =========================================
   CLEAR FAILED ATTEMPTS
========================================= */

const clearFailedAttempts =
  async (
    identifier
  ) => {
    try {
      return await redis.del(
        getKey(
          identifier
        )
      );
    } catch (error) {
      console.error(
        "Clear fraud attempts error:",
        error.message
      );

      return 0;
    }
  };

/* =========================================
   CHECK BLOCK STATUS
========================================= */

const isBlocked =
  async (
    identifier
  ) => {
    try {
      const attempts =
        Number(
          await redis.get(
            getKey(
              identifier
            )
          )
        ) || 0;

      return {
        blocked:
          attempts >=
          MAX_FAILED_ATTEMPTS,

        attempts,

        remaining:
          Math.max(
            0,
            MAX_FAILED_ATTEMPTS -
              attempts
          ),
      };
    } catch (error) {
      console.error(
        "Fraud block check error:",
        error.message
      );

      return {
        blocked: false,
        attempts: 0,
        remaining:
          MAX_FAILED_ATTEMPTS,
      };
    }
  };

/* =========================================
   GET REMAINING LOCK TIME
========================================= */

const getRemainingLockTime =
  async (
    identifier
  ) => {
    try {
      const ttl =
        await redis.ttl(
          getKey(
            identifier
          )
        );

      return ttl > 0
        ? ttl
        : 0;
    } catch (error) {
      console.error(
        "Get lock time error:",
        error.message
      );

      return 0;
    }
  };

module.exports = {
  trackFailedAttempt,
  clearFailedAttempts,
  isBlocked,
  getRemainingLockTime,
};