// src/modules/session/session.repository.js

const Session = require("../../models/Session");

const createSession = (data) => {
  return Session.create(data);
};

const findSessionById = (sessionId) => {
  return Session.findOne({ sessionId });
};

const findSessionByTokenHash = (refreshTokenHash) => {
  return Session.findOne({
    refreshTokenHash,
    revoked: false,
    active: true,
  });
};

const findUserSessions = (userId) => {
  return Session.find({
    user: userId,
    revoked: false,
    active: true,
  }).sort({ createdAt: -1 });
};

const updateSession = (sessionId, data) => {
  return Session.findOneAndUpdate(
    { sessionId },
    data,
    { new: true, runValidators: true }
  );
};

const revokeSessionByTokenHash = (refreshTokenHash) => {
  return Session.findOneAndUpdate(
    { refreshTokenHash, revoked: false },
    {
      revoked: true,
      active: false,
      revokedAt: new Date(),
      logoutAt: new Date(),
      revokeReason: "logout",
    },
    { new: true }
  );
};

const revokeAllUserSessions = (userId, reason = "logout_all") => {
  return Session.updateMany(
    { user: userId, revoked: false },
    {
      revoked: true,
      active: false,
      revokedAt: new Date(),
      logoutAt: new Date(),
      revokeReason: reason,
    }
  );
};

const rotateSessionTokenHash = ({ oldRefreshTokenHash, newRefreshTokenHash }) => {
  return Session.findOneAndUpdate(
    { refreshTokenHash: oldRefreshTokenHash, revoked: false, active: true },
    {
      refreshTokenHash: newRefreshTokenHash,
      lastRefreshAt: new Date(),
      lastActivityAt: new Date(),
    },
    { new: true }
  );
};

const deleteExpiredSessions = () => {
  return Session.deleteMany({ expiresAt: { $lt: new Date() } });
};

module.exports = {
  createSession,
  findSessionById,
  findSessionByTokenHash,
  findUserSessions,
  updateSession,
  revokeSessionByTokenHash,
  revokeAllUserSessions,
  rotateSessionTokenHash,
  deleteExpiredSessions,
};
