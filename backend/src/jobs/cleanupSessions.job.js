// src/jobs/cleanupSessions.job.js

const Session = require(
  "../models/Session"
);

const logger = require(
  "../infrastructure/logger/logger"
);

/* =========================================
   CLEANUP EXPIRED SESSIONS
========================================= */

const cleanupSessions =
  async () => {
    try {
      /* =========================
         DELETE EXPIRED
      ========================= */

      const deleted =
        await Session.deleteMany(
          {
            expiresAt: {
              $lt: new Date(),
            },
          }
        );

      /* =========================
         INVALIDATE OLD INACTIVE
      ========================= */

      const inactiveThreshold =
        new Date(
          Date.now() -
            1000 *
              60 *
              60 *
              24 *
              30
        );

      const updated =
        await Session.updateMany(
          {
            active: true,

            lastActivityAt:
              {
                $lt:
                  inactiveThreshold,
              },
          },
          {
            $set: {
              active: false,

              invalidated: true,

              revoked: true,

              revokedAt:
                new Date(),

              revokeReason:
                "security_compromise",
            },
          }
        );

      logger.info(
        `Session cleanup completed: ${deleted.deletedCount} deleted, ${updated.modifiedCount} invalidated`
      );
    } catch (error) {
      logger.error(
        "Session cleanup failed",
        error
      );
    }
  };

module.exports =
  cleanupSessions;