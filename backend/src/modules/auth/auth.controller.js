// src/modules/auth/auth.controller.js

const asyncHandler = require("../../shared/utils/asyncHandler");
const sendResponse = require("../../shared/utils/sendResponse");
const authService = require("./auth.service");
const ApiError = require("../../shared/utils/ApiError");

const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} = require("../../config/cookie");

const {
  validateEmail,
  validateOTP,
  validateCustomerProfileCompletion,
  validateRegistrationCompletion,
  validateAdminLogin,
  validateLogin,
  validateResetPassword,
  validateChangePassword,
  validateRole,
} = require("./auth.validation");

const { AUTH_MESSAGES } = require("../../shared/constants/auth");

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);
};

const getRequestMeta = (req) => ({
  ipAddress: req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress,
  userAgent: req.get("user-agent") || "Unknown",
});

const sendCustomerSignupOTP = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body);

  const result = await authService.sendCustomerSignupOTP({
    email,
    ...getRequestMeta(req),
  });

  return sendResponse(res, 200, true, result.message);
});

const verifyCustomerSignupOTP = asyncHandler(async (req, res) => {
  validateOTP(req.body);

  const result = await authService.verifyCustomerSignupOTP(req.body);

  return sendResponse(res, 200, true, result.message, {
    requiresProfileCompletion: result.requiresProfileCompletion,
  });
});

const completeCustomerSignup = asyncHandler(async (req, res) => {
  validateEmail(req.body);
  validateRegistrationCompletion(req.body);

  const result = await authService.completeCustomerSignup({
    ...req.body,
    ...getRequestMeta(req),
  });

  setAuthCookies(res, result.accessToken, result.refreshToken);

  return sendResponse(res, 201, true, "Customer account created", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const register = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body);

  const result = await authService.sendCustomerSignupOTP({
    email,
    ...getRequestMeta(req),
  });

  return sendResponse(res, 200, true, result.message);
});

const verifyRegistrationOTP = asyncHandler(async (req, res) => {
  validateOTP(req.body);

  const result = await authService.verifyCustomerSignupOTP(req.body);

  return sendResponse(res, 200, true, result.message, {
    requiresProfileCompletion: result.requiresProfileCompletion,
  });
});

const resendRegistrationOTP = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body);

  const result = await authService.sendCustomerSignupOTP({
    email,
    ...getRequestMeta(req),
  });

  return sendResponse(res, 200, true, result.message);
});

const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const result = await authService.login({
    ...req.body,
    ...getRequestMeta(req),
  });

  setAuthCookies(res, result.accessToken, result.refreshToken);

  return sendResponse(res, 200, true, "Login successful", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const adminLogin = asyncHandler(async (req, res) => {
  validateAdminLogin(req.body);

  const result = await authService.adminLogin({
    ...req.body,
    ...getRequestMeta(req),
  });

  setAuthCookies(res, result.accessToken, result.refreshToken);

  return sendResponse(res, 200, true, "Login successful", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  clearAuthCookies(res);

  return sendResponse(res, 200, true, AUTH_MESSAGES.LOGOUT_SUCCESS);
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const result = await authService.refreshToken(token);

  setAuthCookies(res, result.accessToken, result.newRefreshToken);

  return sendResponse(res, 200, true, "Token refreshed successfully", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body);

  const result = await authService.sendResetCode(email);

  return sendResponse(res, 200, true, result.message);
});

const verifyResetCode = asyncHandler(async (req, res) => {
  validateOTP(req.body);

  const result = await authService.verifyResetCode(req.body);

  return sendResponse(res, 200, true, result.message);
});

const resetPassword = asyncHandler(async (req, res) => {
  validateEmail(req.body);
  validateResetPassword(req.body);

  const result = await authService.resetPassword({
    ...req.body,
    ...getRequestMeta(req),
  });

  setAuthCookies(res, result.accessToken, result.refreshToken);

  return sendResponse(res, 200, true, result.message, {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  validateChangePassword(req.body);

  const result = await authService.changePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  clearAuthCookies(res);

  return sendResponse(res, 200, true, result.message);
});

const selectRole = asyncHandler(async (req, res) => {
  validateRole(req.body.role);

  const result = await authService.selectRole({
    userId: req.user.id,
    role: req.body.role,
  });

  return sendResponse(res, 200, true, "Role selected successfully", {
    user: result.user,
  });
});

const revokeAllSessions = asyncHandler(async (req, res) => {
  await authService.revokeAllSessions(req.user.id);

  clearAuthCookies(res);

  return sendResponse(res, 200, true, "All sessions revoked successfully");
});

const getMe = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, "User fetched successfully", {
    user: req.user,
  });
});

module.exports = {
  sendCustomerSignupOTP,
  verifyCustomerSignupOTP,
  completeCustomerSignup,
  register,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  login,
  adminLogin,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  changePassword,
  selectRole,
  revokeAllSessions,
  getMe,
};
