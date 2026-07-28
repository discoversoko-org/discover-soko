// src/config/cors.js

const cors = require("cors");

const env = require("./env");

/* =========================================
   CORS OPTIONS
========================================= */

const localhostRegex =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const allowedOrigins =
  new Set(env.clientUrls);

const corsOptions = {
  origin: (origin, callback) => {
    const isNoOrigin =
      !origin;

    const isExplicitlyAllowed =
      origin &&
      allowedOrigins.has(origin);

    const isDevLocalhost =
      env.isDevelopment &&
      origin &&
      localhostRegex.test(origin);

    if (
      isNoOrigin ||
      isExplicitlyAllowed ||
      isDevLocalhost
    ) {
      return callback(null, true);
    }

    return callback(
      new Error("CORS not allowed")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

/* =========================================
   CORS MIDDLEWARE
========================================= */

module.exports = cors(corsOptions);