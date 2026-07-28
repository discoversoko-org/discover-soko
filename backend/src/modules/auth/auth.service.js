// src/modules/auth/auth.service.js

const User = require("../../models/User");
const PendingRegistration = require("../../models/PendingRegistration");

const otpService = require("../otp/otp.service");
const tokenService = require("./token.service");
const passwordService = require("./password.service");
const sessionService = require("../session/session.service");
const notificationService = require("../communication/notification.service");
const auditService = require("../security/audit.service");

const { AUTH_MESSAGES, OTP_PURPOSES, OTP_METHODS, USER_STATUS } = require("../../shared/constants/auth");
const { ROLES } = require("../../shared/constants/roles");

const ApiError = require("../../shared/utils/ApiError");

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const logAudit = async (payload) => {
  if (typeof auditService.logEvent === "function") {
    return auditService.logEvent(payload);
  }

  if (typeof auditService.createAuditLog === "function") {
    return auditService.createAuditLog({
      userId: payload.userId,
      action: payload.action,
      entity: payload.entity || "auth",
      entityId: payload.entityId || null,
      description: payload.description || null,
      ipAddress: payload.ipAddress || null,
      userAgent: payload.userAgent || null,
      metadata: {
        status: payload.status || null,
        ...(payload.metadata || {}),
      },
    });
  }

  return null;
};

const createSessionTokens = async ({ user, ipAddress, userAgent }) => {
  const refreshToken = tokenService.generateRefreshToken();

  const session = await sessionService.createSession({
    userId: user._id,
    refreshToken,
    ipAddress,
    userAgent,
  });

  const accessToken = tokenService.generateAccessToken({
    user,
    sessionId: session.sessionId,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const ensureAccountEligibility = (user) => {
  if (!user) {
    return;
  }

  if (user.status === USER_STATUS.SUSPENDED || user.suspendedAt) {
    throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_SUSPENDED);
  }

  if (user.status === USER_STATUS.DELETED || user.deletedAt) {
    throw new ApiError(403, "Account not available. Use another email.");
  }
};

const sendCustomerSignupOTP = async ({ email, ipAddress, userAgent }) => {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    ensureAccountEligibility(existingUser);
    throw new ApiError(409, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  await PendingRegistration.findOneAndUpdate(
    { email: normalizedEmail },
    {
      email: normalizedEmail,
      emailVerified: false,
      emailVerifiedAt: null,
      status: "pending",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const { code } = await otpService.createOTP({
    email: normalizedEmail,
    purpose: OTP_PURPOSES.CUSTOMER_SIGNUP,
    method: OTP_METHODS.EMAIL,
    ipAddress,
    userAgent,
  });

  await notificationService.sendOTPNotification({
    email: normalizedEmail,
    code,
    purpose: OTP_PURPOSES.CUSTOMER_SIGNUP,
  });

  return { success: true, message: AUTH_MESSAGES.OTP_SENT };
};

const verifyCustomerSignupOTP = async ({ email, code }) => {
  const normalizedEmail = normalizeEmail(email);

  await otpService.verifyOTP({
    email: normalizedEmail,
    code,
    purpose: OTP_PURPOSES.CUSTOMER_SIGNUP,
  });

  let pending = await PendingRegistration.findOne({ email: normalizedEmail });

  if (!pending) {
    pending = await PendingRegistration.create({
      email: normalizedEmail,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      status: "pending",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  } else {
    pending.emailVerified = true;
    pending.emailVerifiedAt = new Date();
    pending.status = "pending";
    await pending.save();
  }

  await otpService.deleteOTP({
    email: normalizedEmail,
    purpose: OTP_PURPOSES.CUSTOMER_SIGNUP,
  });

  return {
    success: true,
    message: AUTH_MESSAGES.OTP_VERIFIED,
    requiresProfileCompletion: true,
  };
};

const completeCustomerSignup = async ({ email, firstName, lastName, countryCode, phoneNumber, password, ipAddress, userAgent }) => {
  const normalizedEmail = normalizeEmail(email);

  const pending = await PendingRegistration.findOne({ email: normalizedEmail, emailVerified: true });
  if (!pending) {
    throw new ApiError(403, AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  const user = await User.create({
    email: normalizedEmail,
    firstName: String(firstName).trim(),
    lastName: lastName === undefined || lastName === null || String(lastName).trim() === "" ? null : String(lastName).trim(),
    countryCode: String(countryCode).trim(),
    phoneNumber: String(phoneNumber).replace(/\D/g, ""),
    password: await passwordService.hashPassword(password),
    role: ROLES.CUSTOMER,
    status: USER_STATUS.ACTIVE,
    emailVerified: true,
    emailVerifiedAt: new Date(),
    verificationMethod: OTP_METHODS.EMAIL,
    authProviders: [OTP_METHODS.EMAIL],
    lastLoginAt: new Date(),
    lastSeenAt: new Date(),
  });

  await PendingRegistration.deleteOne({ _id: pending._id });
  await otpService.deleteOTP({ email: normalizedEmail, purpose: OTP_PURPOSES.CUSTOMER_SIGNUP });

  const tokens = await createSessionTokens({ user, ipAddress, userAgent });

  await logAudit({
    userId: user._id,
    action: "REGISTRATION_COMPLETED",
    description: "Customer registration completed",
    status: "SUCCESS",
  });

  return {
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const login = async ({ email, password, ipAddress, userAgent }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  ensureAccountEligibility(user);

  if (!user.emailVerified) {
    throw new ApiError(403, AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  const passwordMatch = await passwordService.comparePassword({
    password,
    hashedPassword: user.password,
  });

  if (!passwordMatch) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  user.lastLoginAt = new Date();
  user.lastSeenAt = new Date();
  await user.save();

  const tokens = await createSessionTokens({ user, ipAddress, userAgent });

  await logAudit({
    userId: user._id,
    action: "LOGIN_SUCCESS",
    description: "User logged in",
    status: "SUCCESS",
  });

  return {
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const adminLogin = async ({ email, password, ipAddress, userAgent }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail, role: ROLES.ADMIN }).select("+password");

  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  ensureAccountEligibility(user);

  const passwordMatch = await passwordService.comparePassword({
    password,
    hashedPassword: user.password,
  });

  if (!passwordMatch) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  user.lastLoginAt = new Date();
  user.lastSeenAt = new Date();
  await user.save();

  const tokens = await createSessionTokens({ user, ipAddress, userAgent });

  await logAudit({
    userId: user._id,
    action: "ADMIN_LOGIN_SUCCESS",
    description: "Admin logged in",
    status: "SUCCESS",
  });

  return {
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

const sendResetCode = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  ensureAccountEligibility(user);

  const { code } = await otpService.createOTP({
    userId: user._id,
    email: normalizedEmail,
    purpose: OTP_PURPOSES.FORGOT_PASSWORD,
    method: OTP_METHODS.EMAIL,
  });

  await notificationService.sendPasswordResetNotification({
    email: normalizedEmail,
    code,
  });

  return {
    success: true,
    message: AUTH_MESSAGES.OTP_SENT,
  };
};

const verifyResetCode = async ({ email, code }) => {
  const normalizedEmail = normalizeEmail(email);

  await otpService.verifyOTP({
    email: normalizedEmail,
    code,
    purpose: OTP_PURPOSES.FORGOT_PASSWORD,
  });

  return {
    success: true,
    message: AUTH_MESSAGES.OTP_VERIFIED,
  };
};

const resetPassword = async ({ email, newPassword, ipAddress, userAgent }) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  ensureAccountEligibility(user);

  user.password = await passwordService.hashPassword(newPassword);
  user.lastPasswordChangedAt = new Date();
  user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
  await user.save();

  await otpService.deleteOTP({
    email: normalizedEmail,
    purpose: OTP_PURPOSES.FORGOT_PASSWORD,
  });

  await sessionService.revokeAllSessions(user._id);

  const tokens = await createSessionTokens({ user, ipAddress, userAgent });

  await logAudit({
    userId: user._id,
    action: "PASSWORD_RESET",
    description: "Password reset completed",
    status: "SUCCESS",
  });

  return {
    success: true,
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
  };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  if (!user.password) {
    throw new ApiError(403, "Account password is not set. Reset password to continue.");
  }

  const passwordMatch = await passwordService.comparePassword({
    password: currentPassword,
    hashedPassword: user.password,
  });

  if (!passwordMatch) {
    throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  user.password = await passwordService.hashPassword(newPassword);
  user.lastPasswordChangedAt = new Date();
  user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
  await user.save();

  await sessionService.revokeAllSessions(user._id);

  return {
    success: true,
    message: AUTH_MESSAGES.PASSWORD_CHANGED_SUCCESS,
  };
};

const logout = async (refreshTokenValue) => {
  await sessionService.revokeSession(refreshTokenValue);

  return {
    success: true,
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
  };
};

const refreshToken = async (refreshTokenValue) => {
  const session = await sessionService.validateSession(refreshTokenValue);

  const user = await User.findById(session.user);
  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  const newRefreshToken = tokenService.generateRefreshToken();
  await sessionService.rotateSessionToken({
    oldRefreshToken: refreshTokenValue,
    newRefreshToken,
  });

  const accessToken = tokenService.generateAccessToken({
    user,
    sessionId: session.sessionId,
  });

  return {
    success: true,
    user,
    accessToken,
    newRefreshToken,
  };
};

const selectRole = async ({ userId, role }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
  }

  user.role = role;
  await user.save();

  return { success: true, user };
};

const revokeAllSessions = async (userId) => {
  return sessionService.revokeAllSessions(userId);
};

module.exports = {
  sendCustomerSignupOTP,
  verifyCustomerSignupOTP,
  completeCustomerSignup,
  login,
  adminLogin,
  logout,
  refreshToken,
  sendResetCode,
  verifyResetCode,
  resetPassword,
  changePassword,
  selectRole,
  revokeAllSessions,
};
