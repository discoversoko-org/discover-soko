// src/config/env.js

const dotenv = require("dotenv");

dotenv.config();

/* =========================================
   NORMALIZE LEGACY ENV VARS
========================================= */

const normalizeEnv = () => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  if (!process.env.CLIENT_URL) {
    process.env.CLIENT_URL = "http://localhost:5173";
  }

  if (!process.env.REDIS_URL) {
    const redisHost = process.env.REDIS_HOST || "127.0.0.1";
    const redisPort = process.env.REDIS_PORT || "6379";
    const redisPassword = process.env.REDIS_PASSWORD;

    const authPart = redisPassword
      ? `:${encodeURIComponent(redisPassword)}@`
      : "";

    process.env.REDIS_URL = `redis://${authPart}${redisHost}:${redisPort}`;
  }

  if (!process.env.JWT_ACCESS_SECRET && process.env.JWT_SECRET) {
    process.env.JWT_ACCESS_SECRET = process.env.JWT_SECRET;
  }

  if (!process.env.JWT_REFRESH_SECRET && process.env.JWT_SECRET) {
    process.env.JWT_REFRESH_SECRET = process.env.JWT_SECRET;
  }

  if (!process.env.JWT_ACCESS_EXPIRES_IN) {
    process.env.JWT_ACCESS_EXPIRES_IN =
      process.env.JWT_ACCESS_EXPIRES || "15m";
  }

  if (!process.env.JWT_REFRESH_EXPIRES_IN) {
    process.env.JWT_REFRESH_EXPIRES_IN =
      process.env.JWT_REFRESH_EXPIRES || "30d";
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUD_NAME) {
    process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUD_NAME;
  }

  if (!process.env.CLOUDINARY_API_KEY && process.env.CLOUD_API_KEY) {
    process.env.CLOUDINARY_API_KEY = process.env.CLOUD_API_KEY;
  }

  if (!process.env.CLOUDINARY_API_SECRET && process.env.CLOUD_API_SECRET) {
    process.env.CLOUDINARY_API_SECRET = process.env.CLOUD_API_SECRET;
  }
};

normalizeEnv();

/* =========================================
   ENVIRONMENT VALIDATION
========================================= */

const requiredEnvVars = [
  "NODE_ENV",

  "MONGO_URI",
  "REDIS_URL",

  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",

  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",

  "CLIENT_URL",

  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable: ${key}`
    );
  }
}

/* =========================================
   ENVIRONMENT FLAGS
========================================= */

const NODE_ENV = process.env.NODE_ENV;

const isProduction =
  NODE_ENV === "production";

const isDevelopment =
  NODE_ENV === "development";

/* =========================================
   ENV CONFIG
========================================= */

const env = {
  nodeEnv: NODE_ENV,

  isProduction,
  isDevelopment,

  port:
    Number(process.env.PORT) || 5000,

  clientUrl:
    process.env.CLIENT_URL,

  clientUrls:
    [
      process.env.CLIENT_URL,
      ...(process.env.CLIENT_URLS || "")
        .split(",")
        .map((value) =>
          value.trim()
        )
        .filter(Boolean),
    ].filter(Boolean),

  mongoUri:
    process.env.MONGO_URI,

  redisUrl:
    process.env.REDIS_URL,

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET,

    refreshSecret:
      process.env.JWT_REFRESH_SECRET,

    accessExpiresIn:
      process.env.JWT_ACCESS_EXPIRES_IN,

    refreshExpiresIn:
      process.env.JWT_REFRESH_EXPIRES_IN,
  },

  cloudinary: {
    cloudName:
      process.env.CLOUDINARY_CLOUD_NAME,

    apiKey:
      process.env.CLOUDINARY_API_KEY,

    apiSecret:
      process.env.CLOUDINARY_API_SECRET,
  },
};

module.exports = env;