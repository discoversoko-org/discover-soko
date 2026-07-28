// src/modules/security/audit.service.js

const AuditLog = require(
  "../../models/AuditLog"
);

/* =========================================
   CREATE AUDIT LOG
========================================= */

const createAuditLog =
  async ({
    userId,
    action,
    entity,
    entityId,
    description = null,
    ipAddress,
    userAgent,
    metadata = {},
  }) => {
    return AuditLog.create({
      user: userId,

      action,

      entity,

      entityId,

      description,

      ipAddress,

      userAgent,

      metadata,
    });
  };

const logEvent =
  async ({
    userId,
    action,
    entity = "auth",
    entityId = null,
    description = null,
    ipAddress = null,
    userAgent = null,
    status = null,
    metadata = {},
  }) => {
    return createAuditLog({
      userId,
      action,
      entity,
      entityId,
      description,
      ipAddress,
      userAgent,
      metadata: {
        status,
        ...metadata,
      },
    });
  };

/* =========================================
   GET USER AUDIT LOGS
========================================= */

const getUserAuditLogs =
  async (userId) => {
    return AuditLog.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });
  };

/* =========================================
   DELETE OLD AUDIT LOGS
========================================= */

const deleteOldAuditLogs =
  async (
    days = 90
  ) => {
    const date =
      new Date();

    date.setDate(
      date.getDate() -
        days
    );

    return AuditLog.deleteMany(
      {
        createdAt: {
          $lt: date,
        },
      }
    );
  };

module.exports = {
  createAuditLog,
  logEvent,
  getUserAuditLogs,
  deleteOldAuditLogs,
};