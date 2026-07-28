// src/config/cookie.js

const env = require("./env");

/* =========================================
   COOKIE CONSTANTS
========================================= */

const FIFTEEN_MINUTES =
  15 * 60 * 1000;

const THIRTY_DAYS =
  30 * 24 * 60 * 60 * 1000;

/* =========================================
   BASE COOKIE OPTIONS
========================================= */

const baseCookieOptions = {
  httpOnly: true,

  secure: env.isProduction,

  sameSite:
    env.isProduction
      ? "none"
      : "lax",

  path: "/",
};

/* =========================================
   ACCESS TOKEN COOKIE
========================================= */

const accessTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: FIFTEEN_MINUTES,
};

/* =========================================
   REFRESH TOKEN COOKIE
========================================= */

const refreshTokenCookieOptions = {
  ...baseCookieOptions,

  maxAge: THIRTY_DAYS,
};

/* =========================================
   CLEAR COOKIE OPTIONS
========================================= */

const clearCookieOptions = {
  ...baseCookieOptions,

  maxAge: 0,
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
};