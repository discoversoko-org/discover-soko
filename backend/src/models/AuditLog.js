const mongoose = require("mongoose");

/* =========================================
   AUDIT LOG SCHEMA
========================================= */

const auditLogSchema = new mongoose.Schema(
  {
    /* =========================================
       USER
    ========================================= */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* =========================================
       ACTION
    ========================================= */

    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: null,
      trim: true,
    },

    /* =========================================
       TARGET
    ========================================= */

    entity: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    /* =========================================
       EXTRA DATA
    ========================================= */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /* =========================================
       REQUEST INFO
    ========================================= */

    ipAddress: {
      type: String,
      default: null,
      index: true,
    },

    userAgent: {
      type: String,
      default: null,
    },

    deviceId: {
      type: String,
      default: null,
      index: true,
    },

    /* =========================================
       RESULT
    ========================================= */

    success: {
      type: Boolean,
      default: true,
      index: true,
    },

    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "info",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================
   INDEXES
========================================= */

auditLogSchema.index({
  user: 1,
  createdAt: -1,
});

auditLogSchema.index({
  action: 1,
  createdAt: -1,
});

auditLogSchema.index({
  entity: 1,
  entityId: 1,
});

auditLogSchema.index({
  severity: 1,
  createdAt: -1,
});

/* =========================================
   EXPORT
========================================= */

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);