// src/modules/otp/otp.constants.js

module.exports = {
  OTP_LENGTH: 4,

  OTP_EXPIRY_MINUTES: 10,

  OTP_RESEND_COOLDOWN_SECONDS: 60,

  OTP_MAX_ATTEMPTS: 5,

  OTP_PURPOSES: {
    CUSTOMER_SIGNUP:
      "customer_signup",

    BUSINESS_SIGNUP:
      "business_signup",

    EMAIL_LOGIN:
      "email_login",

    ADMIN_2FA:
      "admin_2fa",

    FORGOT_PASSWORD:
      "forgot_password",

    RESET_PASSWORD:
      "forgot_password",

    CHANGE_PASSWORD:
      "change_password",

    VERIFY_EMAIL:
      "verify_email",
  },

  OTP_METHODS: {
    EMAIL: "email",
  },
};