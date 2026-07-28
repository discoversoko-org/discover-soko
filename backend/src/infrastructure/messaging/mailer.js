// src/infrastructure/messaging/mailer.js

const nodemailer = require(
  "nodemailer"
);

const logger = require(
  "../logger/logger"
);

/* =========================================
   MAIL TRANSPORTER
========================================= */

const transporter =
  nodemailer.createTransport({
    host:
      process.env.MAIL_HOST,

    port: Number(
      process.env.MAIL_PORT
    ),

    secure:
      Number(
        process.env.MAIL_PORT
      ) === 465,

    auth: {
      user:
        process.env.MAIL_USER,

      pass:
        process.env.MAIL_PASS,
    },

    connectionTimeout:
      15000,

    greetingTimeout:
      10000,

    socketTimeout:
      20000,
  });

/* =========================================
   VERIFY CONNECTION
========================================= */

transporter.verify(
  (error) => {
    if (error) {
      logger.error(
        `❌ Mailer connection failed: ${error.message}`
      );

      return;
    }

    logger.info(
      "✅ Mailer connected"
    );
  }
);

/* =========================================
   EXPORT
========================================= */

module.exports =
  transporter;