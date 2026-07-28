// src/api/auth.api.js

import API from "./axios";

/* =========================================
   RESPONSE HELPERS
========================================= */

const extractData = (
  response
) => {
  const body =
    response?.data || {};

  if (
    body &&
    typeof body ===
      "object" &&
    body.data &&
    typeof body.data ===
      "object"
  ) {
    return {
      ...body,
      ...body.data,
    };
  }

  return body;
};

const extractError = (
  error
) => {
  return (
    error?.response?.data
      ?.message ||
    error?.message ||
    "Request failed"
  );
};

const normalizeError = (
  error
) => {
  const message =
    extractError(error);

  const normalizedError =
    new Error(message);

  normalizedError.response =
    error?.response;
  normalizedError.status =
    error?.response?.status;
  normalizedError.data =
    error?.response?.data;
  normalizedError.config =
    error?.config;

  return normalizedError;
};

const get = async (url) => {
  try {
    const response =
      await API.get(url);

    return extractData(
      response
    );
  } catch (error) {
    throw normalizeError(
      error
    );
  }
};

const post = async (
  url,
  payload = {},
  config = {}
) => {
  try {
    const response =
      await API.post(
        url,
        payload,
        config
      );

    return extractData(
      response
    );
  } catch (error) {
    const normalizedError =
      normalizeError(error);

    if (
      (normalizedError.status || 0) >= 500
    ) {
      console.error(
        "POST ERROR:",
        normalizedError.data ||
          normalizedError
      );
    }

    throw normalizedError;
  }
};

const postWithFallback = async (
  primaryUrl,
  fallbackUrl,
  payload = {},
  config = {}
) => {
  try {
    return await post(
      primaryUrl,
      payload,
      config
    );
  } catch (error) {
    if (
      error?.response
        ?.status === 404 &&
      fallbackUrl
    ) {
      return post(
        fallbackUrl,
        payload,
        config
      );
    }

    throw normalizeError(
      error
    );
  }
};

const patch = async (
  url,
  payload = {}
) => {
  try {
    const response =
      await API.patch(
        url,
        payload
      );

    return extractData(
      response
    );
  } catch (error) {
    throw new Error(
      extractError(error)
    );
  }
};

/* =========================================
   NORMALIZERS
========================================= */

const normalizeEmail = (
  email = ""
) => {
  return String(email)
    .trim()
    .toLowerCase();
};

const normalizeCode = (
  code = ""
) => {
  return String(code)
    .trim();
};

const getEmailFromPayload = (
  payload = ""
) => {
  if (typeof payload === "string") {
    return payload;
  }

  return payload?.email || "";
};

const getCodeFromPayload = (
  payload = {}
) => {
  return (
    payload?.code ||
    payload?.otp ||
    ""
  );
};

const getPasswordFromPayload = (
  payload = {}
) => {
  return (
    payload?.newPassword ||
    payload?.password ||
    ""
  );
};

const getConfirmPasswordFromPayload = (
  payload = {}
) => {
  return payload?.confirmPassword || "";
};

const OTP_REQUEST_TIMEOUT_MS =
  45000;

/* =========================================
   CUSTOMER SIGNUP FLOW
========================================= */

export const sendCustomerSignupOTP =
  async (payload) => {
    return post(
      "/auth/register/send-otp",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(payload)
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const verifyCustomerSignupOTP =
  async (payload) => {
    return post(
      "/auth/register/verify-otp",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(payload)
          ),

        code:
          normalizeCode(
            getCodeFromPayload(payload)
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const completeCustomerSignup =
  async (payload) => {
    return post(
      "/auth/register/complete",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(payload)
          ),

        firstName:
          String(
            payload.firstName ||
              ""
          ).trim(),

        lastName:
          String(
            payload.lastName ||
              ""
          ).trim(),

        countryCode:
          String(
            payload.countryCode ||
              ""
          ).trim(),

        phoneNumber:
          String(
            payload.phoneNumber ||
              payload.phone ||
              ""
          )
            .replace(/\D/g, "")
            .replace(/^0+/, ""),

        password:
          payload.password,

        confirmPassword:
          payload.confirmPassword,
      }
    );
  };

export const sendCustomerLoginOTP =
  async (payload) => {
    return postWithFallback(
      "/auth/customer/login/send-otp",
      "/auth/send-email-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const verifyCustomerLoginOTP =
  async (payload) => {
    return postWithFallback(
      "/auth/customer/login/verify-otp",
      "/auth/verify-email-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

/* =========================================
   BUSINESS SIGNUP FLOW
========================================= */

export const sendBusinessSignupOTP =
  async (payload) => {
    return post(
      "/auth/business/register/send-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const verifyBusinessSignupOTP =
  async (payload) => {
    return post(
      "/auth/business/register/verify-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const resendBusinessSignupOTP =
  async (payload) => {
    return post(
      "/auth/business/register/resend-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const completeBusinessSignup =
  async (payload) => {
    return post(
      "/auth/business/register/complete",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        firstName:
          String(
            payload.firstName ||
              ""
          ).trim(),

        lastName:
          String(
            payload.lastName ||
              ""
          ).trim(),

        password:
          payload.password,

        confirmPassword:
          payload.confirmPassword,

        acceptedPrivacyPolicy:
          Boolean(
            payload.acceptedPrivacyPolicy
          ),
      }
    );
  };

export const sendBusinessLoginOTP =
  async (payload) => {
    return post(
      "/auth/business/login/send-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const verifyBusinessLoginOTP =
  async (payload) => {
    return post(
      "/auth/business/login/verify-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

/* =========================================
   ADMIN 2FA FLOW
========================================= */

export const loginAdmin =
  async (payload) => {
    return post(
      "/auth/admin/login",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        password:
          payload.password,
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const sendAdminLoginChallenge =
  loginAdmin;

export const verifyAdminLoginOTP =
  async (payload) => {
    return post(
      "/auth/admin/login/verify-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

/* =========================================
   LOGIN
========================================= */

export const loginUser =
  async (payload) => {
    return post(
      "/auth/login",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        password:
          payload.password,
      }
    );
  };

export const login = loginUser;

/* =========================================
   LOGOUT
========================================= */

export const logoutUser =
  async () => {
    try {
      await post(
        "/auth/logout"
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      [
        "token",
        "user",
        "role",
        "pendingConsumerEmail",
        "pendingBusinessEmail",
        "pendingRole",
        "pendingLoginRole",
      ].forEach((key) =>
        localStorage.removeItem(
          key
        )
      );
    }
  };

/* =========================================
   EMAIL OTP
========================================= */

export const sendEmailOTP =
  async (payload) => {
    return post(
      "/auth/send-email-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      },
      {
        timeout:
          OTP_REQUEST_TIMEOUT_MS,
      }
    );
  };

export const verifyEmailOTP =
  async (payload) => {
    return post(
      "/auth/verify-email-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      }
    );
  };

/* =========================================
   REGISTRATION OTP
========================================= */

export const verifyRegistrationOTP =
  async (payload) => {
    return post(
      "/auth/verify-registration-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),

        code:
          normalizeCode(
            payload.code
          ),
      }
    );
  };

export const resendRegistrationOTP =
  async (payload) => {
    return post(
      "/auth/resend-registration-otp",
      {
        email:
          normalizeEmail(
            payload.email
          ),
      }
    );
  };

/* =========================================
   PASSWORD RESET
========================================= */

export const forgotPassword =
  async (email) => {
    return post(
      "/auth/forgot-password",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(email)
          ),
      }
    );
  };

export const verifyResetCode =
  async (payload) => {
    return post(
      "/auth/verify-reset-code",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(payload)
          ),

        code:
          normalizeCode(
            getCodeFromPayload(payload)
          ),
      }
    );
  };

export const verifyForgotOTP =
  verifyResetCode;

export const resetPassword =
  async (payload) => {
    return post(
      "/auth/reset-password",
      {
        email:
          normalizeEmail(
            getEmailFromPayload(payload)
          ),

        newPassword:
          getPasswordFromPayload(payload),

        confirmPassword:
          getConfirmPasswordFromPayload(payload),
      }
    );
  };

export const changePassword =
  async (payload) => {
    return patch(
      "/auth/change-password",
      {
        currentPassword:
          payload.currentPassword,

        newPassword:
          payload.newPassword,

        confirmPassword:
          payload.confirmPassword,
      }
    );
  };

/* =========================================
   TOKEN
========================================= */

export const refreshToken =
  async () => {
    return post(
      "/auth/refresh-token"
    );
  };

/* =========================================
   USER
========================================= */

export const getCurrentUser =
  async () => {
    return get(
      "/auth/me"
    );
  };

export const selectRole =
  async (role) => {
    return patch(
      "/auth/select-role",
      {
        role,
      }
    );
  };

/* =========================================
   SESSION
========================================= */

export const revokeAllSessions =
  async () => {
    return post(
      "/auth/revoke-sessions"
    );
  };