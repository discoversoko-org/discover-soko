// src/modules/session/session.service.js

const crypto = require("crypto");

const sessionRepository = require("./session.repository");
const { generateSessionId, parseDeviceInfo, generateSessionExpiry } = require("./session.utils");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
};

const createSession = async ({ userId, refreshToken, ipAddress, userAgent }) => {
  const deviceInfo = parseDeviceInfo(userAgent);

  return sessionRepository.createSession({
    user: userId,
    sessionId: generateSessionId(),
    refreshTokenHash: hashToken(refreshToken),
    familyId: generateSessionId(),
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    deviceName: deviceInfo.device,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    expiresAt: generateSessionExpiry(),
    active: true,
    revoked: false,
  });
};

const validateSession = async (refreshToken) => {
  const session = await sessionRepository.findSessionByTokenHash(hashToken(refreshToken));

  if (!session) {
    throw { status: 401, message: "Session not found" };
  }

  if (session.revoked || !session.active) {
    throw { status: 401, message: "Session revoked" };
  }

  if (session.expiresAt < new Date()) {
    throw { status: 401, message: "Session expired" };
  }

  return session;
};

const findSessionByToken = async (refreshToken) => {
  return sessionRepository.findSessionByTokenHash(hashToken(refreshToken));
};

const rotateSessionToken = async ({ oldRefreshToken, newRefreshToken }) => {
  return sessionRepository.rotateSessionTokenHash({
    oldRefreshTokenHash: hashToken(oldRefreshToken),
    newRefreshTokenHash: hashToken(newRefreshToken),
  });
};

const getUserSessions = async (userId) => {
  return sessionRepository.findUserSessions(userId);
};

const revokeSession = async (refreshToken) => {
  return sessionRepository.revokeSessionByTokenHash(hashToken(refreshToken));
};

const deleteSession = async (refreshToken) => {
  return revokeSession(refreshToken);
};

const revokeAllSessions = async (userId) => {
  return sessionRepository.revokeAllUserSessions(userId);
};

const cleanupExpiredSessions = async () => {
  return sessionRepository.deleteExpiredSessions();
};

module.exports = {
  createSession,
  validateSession,
  findSessionByToken,
  rotateSessionToken,
  getUserSessions,
  revokeSession,
  deleteSession,
  revokeAllSessions,
  cleanupExpiredSessions,
};
