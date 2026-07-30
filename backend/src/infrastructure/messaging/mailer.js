// src/infrastructure/messaging/mailer.js

const nodemailer = require("nodemailer");

const logger = require("../logger/logger");

/* =========================================
   MAIL TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,

  port: Number(process.env.MAIL_PORT),

  secure: Number(process.env.MAIL_PORT) === 465,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  // Prefer IPv4 to avoid IPv6 routing issues
  family: 4,

  connectionTimeout: 15000,

  greetingTimeout: 10000,

  socketTimeout: 20000,

  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

/* =========================================
   VERIFY CONNECTION
========================================= */

const verifyMailer = async () => {
  try {
    logger.info("📧 Verifying mail server connection...");

    logger.info(
      `📧 SMTP: ${process.env.MAIL_HOST}:${process.env.MAIL_PORT}`
    );

    logger.info(
      `📧 User: ${process.env.MAIL_USER}`
    );

    await transporter.verify();

    logger.info("✅ Mailer connected");
  } catch (error) {
    logger.error(
      `❌ Mailer connection failed: ${error.message}`
    );

    // Continue running even if SMTP is unavailable.
    logger.warn(
      "⚠️ Email sending will be unavailable until the SMTP server becomes reachable."
    );
  }
};

verifyMailer();

/* =========================================
   EXPORT
========================================= */

module.exports = transporter;