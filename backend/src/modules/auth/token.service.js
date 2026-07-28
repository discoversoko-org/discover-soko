// src/modules/auth/token.service.js

const jwt = require("jsonwebtoken");

const Session = require(
  "../../models/Session"
);

const {
  generateRandomToken,
  generateSessionId,
} = require("./auth.utils");

/* =========================================
   GENERATE ACCESS TOKEN
========================================= */

const generateAccessToken =
  ({
    user,
    sessionId,
  }) => {
    return jwt.sign(
      {
        id: user._id,
        userId: user._id,

        email: user.email,

        role: user.role,

        sessionId,
      },

      process.env
        .JWT_ACCESS_SECRET,

      {
        expiresIn:
          process.env
            .JWT_ACCESS_EXPIRES ||
          "15m",
      }
    );
  };

/* =========================================
   GENERATE REFRESH TOKEN
========================================= */

const generateRefreshToken =
  () => {
    return generateRandomToken(
      64
    );
  };

/* =========================================
   CREATE USER SESSION
========================================= */

const createSession =
  async ({
    userId,
    refreshToken,
    ipAddress,
    userAgent,
  }) => {
    const sessionId =
      generateSessionId();

    const expiresAt =
      new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            30
      );

    const session =
      await Session.create({
        userId,

        sessionId,

        refreshToken,

        ipAddress,

        userAgent,

        expiresAt,

        active: true,

        revoked: false,

        lastActivityAt:
          new Date(),
      });

    return session;
  };

/* =========================================
   VERIFY ACCESS TOKEN
========================================= */

const verifyAccessToken =
  (token) => {
    return jwt.verify(
      token,
      process.env
        .JWT_ACCESS_SECRET
    );
  };

/* =========================================
   FIND ACTIVE SESSION
========================================= */

const findSessionByRefreshToken =
  async (
    refreshToken
  ) => {
    return Session.findOne({
      refreshToken,

      revoked: false,

      active: true,

      expiresAt: {
        $gt: new Date(),
      },
    });
  };

/* =========================================
   FIND SESSION BY ID
========================================= */

const findSessionById =
  async (sessionId) => {
    return Session.findOne({
      sessionId,

      revoked: false,

      active: true,
    });
  };

/* =========================================
   REVOKE SESSION
========================================= */

const revokeSession =
  async (
    refreshToken
  ) => {
    return Session.updateOne(
      {
        refreshToken,
      },
      {
        revoked: true,

        active: false,
      }
    );
  };

/* =========================================
   REVOKE SESSION BY ID
========================================= */

const revokeSessionById =
  async (
    sessionId
  ) => {
    return Session.updateOne(
      {
        sessionId,
      },
      {
        revoked: true,

        active: false,
      }
    );
  };

/* =========================================
   REVOKE ALL USER SESSIONS
========================================= */

const revokeAllUserSessions =
  async (userId) => {
    return Session.updateMany(
      {
        userId,
      },
      {
        revoked: true,

        active: false,
      }
    );
  };

/* =========================================
  GENERATE RESET TOKEN
========================================= */

const generateResetToken =
  (user) => {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        type: "reset",
      },
      process.env
        .JWT_ACCESS_SECRET,
      {
        expiresIn:
          "1h",
      }
    );
  };

/* =========================================
  VERIFY REFRESH TOKEN
========================================= */

const verifyRefreshToken =
  (token) => {
    const decoded =
      jwt.decode(token);
    return decoded;
  };

module.exports = {
  generateAccessToken,

  generateRefreshToken,

  createSession,

  verifyAccessToken,

  findSessionByRefreshToken,

  findSessionById,

  revokeSession,

  revokeSessionById,

  revokeAllUserSessions,

  generateResetToken,

  verifyRefreshToken,
};