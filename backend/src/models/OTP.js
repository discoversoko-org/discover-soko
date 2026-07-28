const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    /* =========================
       USER
    ========================= */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    role: {
      type: String,
      enum: ["customer", "business", "admin"],
      default: "customer",
      index: true,
    },

    /* =========================
       EMAIL
    ========================= */

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /* =========================
       OTP
    ========================= */

    codeHash: {
      type: String,
      required: true,
      select: false,
    },

    otpLength: {
      type: Number,
      default: 4,
      immutable: true,
    },

    purpose: {
      type: String,
      enum: [
        "verify_email",
        "business_email_verification",
        "forgot_password",
        "login",
        "registration",
        "customer_signup",
        "business_signup",
        "email_login",
        "admin_2fa",
        "change_password",
      ],
      required: true,
      index: true,
    },

    /* =========================
       STATUS
    ========================= */

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    consumed: {
      type: Boolean,
      default: false,
      index: true,
    },

    invalidated: {
      type: Boolean,
      default: false,
      index: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true,
    },

    failureReason: {
      type: String,
      default: null,
    },

    /* =========================
       SECURITY
    ========================= */

    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
    },

    resendCount: {
      type: Number,
      default: 0,
      index: true,
    },

    maxResends: {
      type: Number,
      default: 3,
    },

    /* =========================
       TIMESTAMPS
    ========================= */

    lastSentAt: {
      type: Date,
      default: Date.now,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    consumedAt: {
      type: Date,
      default: null,
    },

    invalidatedAt: {
      type: Date,
      default: null,
    },

    /* =========================
       REQUEST INFO
    ========================= */

    ipAddress: {
      type: String,
      default: null,
      index: true,
    },

    userAgent: {
      type: String,
      default: null,
    },

    suspicious: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =========================
       EXPIRY
    ========================= */

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* =========================
   TTL INDEX
========================= */

otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

/* =========================
   PERFORMANCE INDEXES
========================= */

otpSchema.index({
  email: 1,
  purpose: 1,
  invalidated: 1,
  consumed: 1,
});

otpSchema.index({
  email: 1,
  purpose: 1,
  verified: 1,
  consumed: 1,
  invalidated: 1,
});

otpSchema.index({
  userId: 1,
  purpose: 1,
});

otpSchema.index({
  ipAddress: 1,
  createdAt: -1,
});

/* =========================
   AUTO INVALIDATION
========================= */

otpSchema.pre("save", function () {
  if (this.expiresAt <= new Date()) {
    this.invalidated = true;
    this.invalidatedAt = new Date();
  }
});

module.exports = mongoose.model("OTP", otpSchema);