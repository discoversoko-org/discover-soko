// src/modules/otp/otp.queue.js

const {
  Queue,
} = require(
  "bullmq"
);

const redis = require(
  "../../infrastructure/cache/redis"
);

/* =========================================
   OTP QUEUE
========================================= */

const otpQueue =
  new Queue(
    "otp-queue",
    {
      connection: redis,
    }
  );

/* =========================================
   ADD OTP JOB
========================================= */

const addOTPJob =
  async (
    jobName,
    payload
  ) => {
    return otpQueue.add(
      jobName,
      payload,
      {
        attempts: 3,

        backoff: {
          type: "exponential",

          delay: 2000,
        },

        removeOnComplete: 50,

        removeOnFail: 100,
      }
    );
  };

module.exports = {
  otpQueue,
  addOTPJob,
};