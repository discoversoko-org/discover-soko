// src/config/jwt.js

const env = require("./env");

/* =========================================
   JWT CONFIG
========================================= */

module.exports = {
  accessToken: {
    secret:
      env.jwt.accessSecret,

    expiresIn:
      env.jwt.accessExpiresIn,
  },

  refreshToken: {
    secret:
      env.jwt.refreshSecret,

    expiresIn:
      env.jwt.refreshExpiresIn,
  },
};