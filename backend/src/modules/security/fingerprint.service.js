// src/modules/security/fingerprint.service.js

const crypto = require(
  "crypto"
);

/* =========================================
   GENERATE FINGERPRINT
========================================= */

const generateFingerprint =
  ({
    ipAddress,
    userAgent,
    acceptLanguage,
  }) => {
    const raw =
      `${ipAddress}:${userAgent}:${acceptLanguage}`;

    return crypto
      .createHash("sha256")
      .update(raw)
      .digest("hex");
  };

/* =========================================
   EXTRACT REQUEST FINGERPRINT
========================================= */

const getRequestFingerprint =
  (req) => {
    return generateFingerprint(
      {
        ipAddress:
          req.ip,

        userAgent:
          req.get(
            "user-agent"
          ) || "",

        acceptLanguage:
          req.get(
            "accept-language"
          ) || "",
      }
    );
  };

module.exports = {
  generateFingerprint,
  getRequestFingerprint,
};