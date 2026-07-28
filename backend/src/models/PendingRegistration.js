const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    firstName: {
      type: String,
      default: null,
      trim: true,
    },

    lastName: {
      type: String,
      default: null,
      trim: true,
    },

    countryCode: {
      type: String,
      default: null,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
      index: true,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
