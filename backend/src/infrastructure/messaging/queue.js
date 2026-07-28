// src/infrastructure/messaging/queue.js

const {
  Queue,
  Worker,
  QueueEvents,
} = require("bullmq");

const redis = require(
  "../cache/redis"
);

const logger = require(
  "../logger/logger"
);

/* =========================================
   QUEUE CONNECTION
========================================= */

const connection = redis;

/* =========================================
   DEFAULT JOB OPTIONS
========================================= */

const defaultJobOptions = {
  attempts: 3,

  backoff: {
    type: "exponential",

    delay: 3000,
  },

  removeOnComplete: 100,

  removeOnFail: 500,
};

/* =========================================
   QUEUES
========================================= */

const otpQueue = new Queue(
  "otpQueue",
  {
    connection,

    defaultJobOptions,
  }
);

const emailQueue = new Queue(
  "emailQueue",
  {
    connection,

    defaultJobOptions,
  }
);

/* =========================================
   QUEUE EVENTS
========================================= */

const otpQueueEvents =
  new QueueEvents(
    "otpQueue",
    {
      connection,
    }
  );

const emailQueueEvents =
  new QueueEvents(
    "emailQueue",
    {
      connection,
    }
  );

/* =========================================
   WORKER FACTORY
========================================= */

const createWorker = (
  queueName,
  processor,
  concurrency = 5
) => {
  const worker = new Worker(
    queueName,
    processor,
    {
      connection,

      concurrency,
    }
  );

  /* =========================================
     WORKER EVENTS
  ========================================= */

  worker.on(
    "completed",
    (job) => {
      logger.info(
        `✅ Job completed: ${queueName} -> ${job.id}`
      );
    }
  );

  worker.on(
    "failed",
    (job, error) => {
      logger.error(
        `❌ Job failed: ${queueName} -> ${job?.id} -> ${error.message}`
      );
    }
  );

  worker.on(
    "error",
    (error) => {
      logger.error(
        `❌ Worker error: ${queueName} -> ${error.message}`
      );
    }
  );

  return worker;
};

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  connection,

  Queue,
  Worker,
  QueueEvents,

  otpQueue,
  emailQueue,

  otpQueueEvents,
  emailQueueEvents,

  createWorker,
};