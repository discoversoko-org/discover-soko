// src/jobs/cleanupExpiredOtps.job.js

const OTP = require(
  "../models/OTP"
);

const logger = require(
  "../infrastructure/logger/logger"
);

/* =========================================
   CLEANUP EXPIRED OTPS
========================================= */

const cleanupExpiredOtps =
  async () => {
    try {
      const result =
        await OTP.deleteMany({
          $or: [
            {
              expiresAt: {
                $lt: new Date(),
              },
            },
            {
              invalidated: true,
            },
            {
              consumed: true,
            },
          ],
        });

      logger.info(
        `Expired OTP cleanup completed: ${result.deletedCount} removed`
      );
    } catch (error) {
      logger.error(
        "OTP cleanup failed",
        error
      );
    }
  };

module.exports =
  cleanupExpiredOtps;