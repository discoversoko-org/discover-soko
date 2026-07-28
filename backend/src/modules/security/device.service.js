// src/modules/security/device.service.js

/* =========================================
   DEVICE DETECTION
========================================= */

const detectDevice =
  (userAgent = "") => {
    const ua =
      userAgent.toLowerCase();

    let type = "desktop";

    if (
      ua.includes(
        "mobile"
      )
    ) {
      type = "mobile";
    }

    if (
      ua.includes(
        "tablet"
      )
    ) {
      type = "tablet";
    }

    return type;
  };

/* =========================================
   BROWSER DETECTION
========================================= */

const detectBrowser =
  (userAgent = "") => {
    const ua =
      userAgent.toLowerCase();

    if (
      ua.includes(
        "chrome"
      )
    ) {
      return "Chrome";
    }

    if (
      ua.includes(
        "firefox"
      )
    ) {
      return "Firefox";
    }

    if (
      ua.includes(
        "safari"
      )
    ) {
      return "Safari";
    }

    if (
      ua.includes(
        "edge"
      )
    ) {
      return "Edge";
    }

    return "Unknown";
  };

/* =========================================
   OS DETECTION
========================================= */

const detectOS = (
  userAgent = ""
) => {
  const ua =
    userAgent.toLowerCase();

  if (
    ua.includes(
      "windows"
    )
  ) {
    return "Windows";
  }

  if (
    ua.includes(
      "android"
    )
  ) {
    return "Android";
  }

  if (
    ua.includes("iphone")
  ) {
    return "iPhone";
  }

  if (
    ua.includes("mac")
  ) {
    return "MacOS";
  }

  if (
    ua.includes(
      "linux"
    )
  ) {
    return "Linux";
  }

  return "Unknown";
};

/* =========================================
   GET DEVICE INFO
========================================= */

const getDeviceInfo =
  (userAgent = "") => {
    return {
      type:
        detectDevice(
          userAgent
        ),

      browser:
        detectBrowser(
          userAgent
        ),

      os: detectOS(
        userAgent
      ),
    };
  };

module.exports = {
  detectDevice,
  detectBrowser,
  detectOS,
  getDeviceInfo,
};