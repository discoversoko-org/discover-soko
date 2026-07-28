// src/middleware/rateLimit.middleware.js

const rateLimit = require(
  "express-rate-limit"
);

const {
  RedisStore,
} = require(
  "rate-limit-redis"
);

const {
  ipKeyGenerator,
} = require(
  "express-rate-limit"
);

const {
  env,
} = require("../config");

const redis = require(
  "../infrastructure/cache/redis"
);

const useRedisStore =
  env.isProduction;

/* =========================================
   REDIS STORE
========================================= */

const createStore = (
  prefix
) => {
  if (!useRedisStore) {
    return undefined;
  }

  return new RedisStore({
    prefix,

    sendCommand:
      async (
        ...args
      ) => {
        return redis.send_command(
          args[0],
          args.slice(1)
        );
      },
  });
};

/* =========================================
   KEY GENERATOR
========================================= */

const keyGenerator = (
  req
) => {
  return ipKeyGenerator(
    req.ip
  );
};

/* =========================================
   DEFAULT HANDLER
========================================= */

const defaultHandler =
  (
    message
  ) =>
  (
    req,
    res
  ) => {
    return res
      .status(429)
      .json({
        success: false,

        statusCode: 429,

        message,

        path:
          req.originalUrl,
      });
  };

/* =========================================
   LIMITER FACTORY
========================================= */

const createLimiter = ({
  windowMs,
  max,
  prefix,
  message,
}) => {
  const store =
    createStore(prefix);

  return rateLimit({
    windowMs,

    max:
      Number(max),

    standardHeaders:
      true,

    legacyHeaders:
      false,

    validate:
      false,

    trustProxy:
      true,

    keyGenerator,

    ...(store
      ? { store }
      : {}),

    handler:
      defaultHandler(
        message
      ),
  });
};

/* =========================================
   LIMITERS
========================================= */

const globalLimiter =
  createLimiter({
    windowMs:
      15 *
      60 *
      1000,

    max:
      process.env
        .GLOBAL_RATE_LIMIT ||
      300,

    prefix:
      "rl:global:",

    message:
      "Too many requests. Please try again later.",
  });

const authLimiter =
  createLimiter({
    windowMs:
      15 *
      60 *
      1000,

    max:
      process.env
        .AUTH_RATE_LIMIT ||
      10,

    prefix:
      "rl:auth:",

    message:
      "Too many authentication attempts.",
  });

const otpLimiter =
  createLimiter({
    windowMs:
      10 *
      60 *
      1000,

    max:
      process.env
        .OTP_RATE_LIMIT ||
      5,

    prefix:
      "rl:otp:",

    message:
      "Too many OTP requests.",
  });

const apiLimiter =
  createLimiter({
    windowMs:
      60 * 1000,

    max:
      process.env
        .API_RATE_LIMIT ||
      100,

    prefix:
      "rl:api:",

    message:
      "API rate limit exceeded.",
  });

const strictLimiter =
  createLimiter({
    windowMs:
      60 *
      60 *
      1000,

    max: 5,

    prefix:
      "rl:strict:",

    message:
      "Too many sensitive requests.",
  });

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  globalLimiter,

  authLimiter,

  otpLimiter,

  apiLimiter,

  strictLimiter,
};