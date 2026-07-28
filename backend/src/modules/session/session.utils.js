// src/modules/session/session.utils.js

const crypto = require("crypto");

/* =========================================
   GENERATE SESSION ID
========================================= */

const generateSessionId = () => {
  return crypto.randomBytes(32).toString("hex");
};

/* =========================================
   GENERATE DEVICE NAME
========================================= */

const parseDeviceInfo = (
  userAgent = ""
) => {
  const agent =
    userAgent.toLowerCase();

  let browser = "Unknown";
  let os = "Unknown";

  /* =========================
     BROWSER
  ========================= */

  if (agent.includes("chrome")) {
    browser = "Chrome";
  } else if (
    agent.includes("firefox")
  ) {
    browser = "Firefox";
  } else if (
    agent.includes("safari")
  ) {
    browser = "Safari";
  } else if (
    agent.includes("edge")
  ) {
    browser = "Edge";
  }

  /* =========================
     OS
  ========================= */

  if (
    agent.includes("windows")
  ) {
    os = "Windows";
  } else if (
    agent.includes("android")
  ) {
    os = "Android";
  } else if (
    agent.includes("iphone")
  ) {
    os = "iPhone";
  } else if (
    agent.includes("mac")
  ) {
    os = "MacOS";
  } else if (
    agent.includes("linux")
  ) {
    os = "Linux";
  }

  return {
    browser,
    os,
    device:
      `${browser} on ${os}`,
  };
};

/* =========================================
   SESSION EXPIRY
========================================= */

const generateSessionExpiry =
  (
    days = 30
  ) => {
    return new Date(
      Date.now() +
        days *
          24 *
          60 *
          60 *
          1000
    );
  };

module.exports = {
  generateSessionId,
  parseDeviceInfo,
  generateSessionExpiry,
};