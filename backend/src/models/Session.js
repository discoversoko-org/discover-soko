const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    /* =========================================
       USER
    ========================================= */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================================
       REFRESH TOKEN
    ========================================= */

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    familyId: {
      type: String,
      required: true,
      index: true,
    },

    parentSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    /* =========================================
       DEVICE
    ========================================= */

    deviceId: {
      type: String,
      default: null,
      index: true,
    },

    deviceName: {
      type: String,
      default: null,
    },

    deviceType: {
      type: String,
      enum: [
        "mobile",
        "tablet",
        "desktop",
        "bot",
        "unknown",
      ],
      default: "unknown",
      index: true,
    },

    browser: {
      type: String,
      default: null,
    },

    os: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    /* =========================================
       NETWORK
    ========================================= */

    ipAddress: {
      type: String,
      default: null,
      index: true,
    },

    country: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      default: null,
    },

    timezone: {
      type: String,
      default: null,
    },

    /* =========================================
       SESSION STATE
    ========================================= */

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    revoked: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokeReason: {
      type: String,
      enum: [
        "logout",
        "logout_all",
        "refresh_reuse",
        "admin_revoked",
        "security_compromise",
        null,
      ],
      default: null,
    },

    invalidated: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =========================================
       ACTIVITY
    ========================================= */

    loginAt: {
      type: Date,
      default: Date.now,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    lastRefreshAt: {
      type: Date,
      default: null,
    },

    logoutAt: {
      type: Date,
      default: null,
    },

    /* =========================================
       SECURITY
    ========================================= */

    suspicious: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =========================================
       EXPIRY
    ========================================= */

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================================
   TTL INDEX (AUTO DELETE EXPIRED SESSIONS)
========================================= */

sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

/* =========================================
   PERFORMANCE INDEXES
========================================= */

sessionSchema.index({
  user: 1,
  active: 1,
  revoked: 1,
});

sessionSchema.index({
  user: 1,
  deviceId: 1,
});

sessionSchema.index({
  familyId: 1,
  active: 1,
});

sessionSchema.index({
  lastActivityAt: -1,
});

sessionSchema.index({
  active: 1,
  expiresAt: 1,
});

/* =========================================
   AUTO INVALIDATION
========================================= */

sessionSchema.pre("save", function () {
  if (this.expiresAt <= new Date()) {
    this.active = false;
    this.invalidated = true;
  }
});

module.exports = mongoose.model("Session", sessionSchema);