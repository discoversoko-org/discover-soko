// src/jobs/deleteUnverifiedUsers.job.js

const User = require(
  "../models/User"
);

const OTP = require(
  "../models/OTP"
);

const Session = require(
  "../models/Session"
);

const logger = require(
  "../infrastructure/logger/logger"
);

/* =========================================
   DELETE UNVERIFIED USERS
========================================= */

const deleteUnverifiedUsers =
  async () => {
    try {
      /* =========================
         OLDER THAN 3 DAYS
      ========================= */

      const threshold =
        new Date(
          Date.now() -
            1000 *
              60 *
              60 *
              24 *
              3
        );

      const users =
        await User.find({
          emailVerified:
            false,

          status:
            "pending",

          createdAt: {
            $lt:
              threshold,
          },
        }).select("_id");

      const userIds =
        users.map(
          (user) =>
            user._id
        );

      if (
        userIds.length === 0
      ) {
        logger.info(
          "No unverified users found"
        );

        return;
      }

      /* =========================
         DELETE RELATED DATA
      ========================= */

      await OTP.deleteMany({
        userId: {
          $in: userIds,
        },
      });

      await Session.deleteMany(
        {
          user: {
            $in: userIds,
          },
        }
      );

      /* =========================
         DELETE USERS
      ========================= */

      const result =
        await User.deleteMany({
          _id: {
            $in: userIds,
          },
        });

      logger.info(
        `Deleted ${result.deletedCount} unverified users`
      );
    } catch (error) {
      logger.error(
        "Delete unverified users job failed",
        error
      );
    }
  };

module.exports =
  deleteUnverifiedUsers;