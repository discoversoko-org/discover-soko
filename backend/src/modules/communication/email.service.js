// src/modules/communication/email.service.js

const mailer = require(
  "../../infrastructure/messaging/mailer"
);

const {
  otpEmailTemplate,
  passwordResetTemplate,
  loginAlertTemplate,
} = require(
  "./email.template"
);

/* =========================================
   SEND EMAIL
========================================= */

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    return await mailer.sendMail({
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );

    throw {
      status: 500,
      message:
        "Failed to send email",
    };
  }
};

/* =========================================
   SEND OTP EMAIL
========================================= */

const sendOTPEmail =
  async ({
    email,
    code,
    title =
      "Verification Code",
  }) => {
    return sendEmail({
      to: email,

      subject: title,

      html:
        otpEmailTemplate(
          {
            code,
            title,
          }
        ),
    });
  };

/* =========================================
   SEND PASSWORD RESET EMAIL
========================================= */

const sendPasswordResetEmail =
  async ({
    email,
    code,
  }) => {
    return sendEmail({
      to: email,

      subject:
        "Password Reset",

      html:
        passwordResetTemplate(
          {
            code,
          }
        ),
    });
  };

/* =========================================
   SEND LOGIN ALERT EMAIL
========================================= */

const sendLoginAlertEmail =
  async ({
    email,
    device,
    ipAddress,
  }) => {
    return sendEmail({
      to: email,

      subject:
        "New Login Alert",

      html:
        loginAlertTemplate(
          {
            device,
            ipAddress,
          }
        ),
    });
  };

module.exports = {
  sendEmail,

  sendOTPEmail,

  sendPasswordResetEmail,

  sendLoginAlertEmail,
};