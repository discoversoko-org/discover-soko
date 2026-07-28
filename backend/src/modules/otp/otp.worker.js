// src/modules/otp/otp.worker.js

const {
  Worker,
} = require(
  "bullmq"
);

const redis = require(
  "../../infrastructure/cache/redis"
);

/* =========================================
   WORKER
========================================= */

const otpWorker =
  new Worker(
    "otp-queue",

    async (job) => {
      console.log(
        `Processing OTP job: ${job.name}`
      );

      console.log(job.data);

      return true;
    },

    {
      connection: redis,
    }
  );

/* =========================================
   EVENTS
========================================= */

otpWorker.on(
  "completed",
  (job) => {
    console.log(
      `Job completed: ${job.id}`
    );
  }
);

otpWorker.on(
  "failed",
  (job, err) => {
    console.error(
      `Job failed: ${job.id}`,
      err
    );
  }
);

module.exports =
  otpWorker;