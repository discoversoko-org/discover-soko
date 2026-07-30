// src/infrastructure/messaging/mailer.js

const { Resend } = require("resend");

const logger = require("../logger/logger");

/* =========================================
   RESEND CLIENT
========================================= */

const resend = new Resend(
  process.env.RESEND_API_KEY
);

/* =========================================
   VERIFY CONFIGURATION
========================================= */

const verifyMailer = async () => {
  try {
    logger.info(
      "📧 Verifying Resend configuration..."
    );

    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is missing."
      );
    }

    if (!process.env.MAIL_FROM) {
      throw new Error(
        "MAIL_FROM is missing."
      );
    }

    logger.info(
      `📧 From: ${process.env.MAIL_FROM}`
    );

    logger.info(
      "✅ Resend configured successfully"
    );
  } catch (error) {
    logger.error(
      `❌ Mail configuration failed: ${error.message}`
    );

    logger.warn(
      "⚠️ Email sending will be unavailable until the configuration is fixed."
    );
  }
};

verifyMailer();

/* =========================================
   SEND EMAIL
========================================= */

const sendMail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    const response =
      await resend.emails.send({
        from: process.env.MAIL_FROM,
        to: Array.isArray(to)
          ? to
          : [to],
        subject,
        html,
        text,
      });

    logger.info(
      `✅ Email sent to ${Array.isArray(to) ? to.join(", ") : to}`
    );

    return response;
  } catch (error) {
    logger.error(
      `❌ Failed to send email: ${
        error.message || error
      }`
    );

    throw error;
  }
};

/* =========================================
   EXPORT
========================================= */

module.exports = {
  resend,
  sendMail,
};