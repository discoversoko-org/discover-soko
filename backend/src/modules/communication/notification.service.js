// src/modules/communication/notification.service.js

const emailService = require("./email.service");

/* =========================================
   SEND OTP
========================================= */

const sendOTPNotification = async ({ email, code, purpose }) => {
  return emailService.sendOTPEmail({
    email,
    code,
    title: purpose === "admin_2fa" ? "Admin 2FA Code" : "Verification Code",
  });
};

/* =========================================
   SEND PASSWORD RESET
========================================= */

const sendPasswordResetNotification = async ({ email, code }) => {
  return emailService.sendPasswordResetEmail({
    email,
    code,
  });
};

/* =========================================
   SEND LOGIN ALERT
========================================= */

const sendLoginAlert = async ({ email, device, ipAddress }) => {
  if (!email) {
    return null;
  }

  return emailService.sendLoginAlertEmail({
    email,
    device,
    ipAddress,
  });
};

module.exports = {
  sendOTPNotification,
  sendPasswordResetNotification,
  sendLoginAlert,
};
