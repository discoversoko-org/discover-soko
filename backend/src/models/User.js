const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC PROFILE
    ========================= */

    firstName: {
      type: String,
      default: null,
      trim: true,
      minlength: 2,
      maxlength: 50,
      index: true,
    },

    lastName: {
      type: String,
      default: null,
      trim: true,
      minlength: 2,
      maxlength: 50,
      index: true,
    },

    avatar: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },

    /* =========================
       EMAIL
    ========================= */

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      match: /^\S+@\S+\.\S+$/,
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

    /* =========================
       PASSWORD
    ========================= */

    password: {
      type: String,
      default: null,
      minlength: 6,
      select: false,
    },

    lastPasswordChangedAt: {
      type: Date,
      default: null,
    },

    /* =========================
       PHONE
    ========================= */

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

    fullPhoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    /* =========================
       ROLE
    ========================= */

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      index: true,
    },

    /* =========================
       ACCOUNT STATUS
    ========================= */

    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "inactive",
        "suspended",
        "deleted",
      ],
      default: "pending",
      index: true,
    },

    suspendedReason: {
      type: String,
      default: null,
    },

    suspendedAt: {
      type: Date,
      default: null,
    },

    /* =========================
       SECURITY
    ========================= */

    verificationMethod: {
      type: String,
      default: null,
    },

    authProviders: {
      type: [String],
      default: [],
    },

    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    blockedUntil: {
      type: Date,
      default: null,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastSeenAt: {
      type: Date,
      default: null,
      index: true,
    },

    refreshTokenVersion: {
      type: Number,
      default: 0,
      index: true,
    },

    /* =========================
       RELATIONS
    ========================= */

    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },

    /* =========================
       SOFT DELETE
    ========================= */

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.loginAttempts;
        delete ret.blockedUntil;

        return ret;
      },
    },
  }
);

/* =========================
   INDEXES
========================= */

userSchema.index({
  role: 1,
  status: 1,
});

userSchema.index({
  email: 1,
  status: 1,
});

userSchema.index({
  fullPhoneNumber: 1,
  status: 1,
});

userSchema.index({
  status: 1,
  lastSeenAt: -1,
});

/* =========================
   PHONE NORMALIZATION
========================= */

userSchema.pre("save", function () {
  if (this.countryCode) {
    this.countryCode = this.countryCode.trim();
  }

  if (this.phoneNumber) {
    this.phoneNumber = this.phoneNumber.trim();
  }

  if (this.countryCode && this.phoneNumber) {
    this.fullPhoneNumber = `${this.countryCode}${this.phoneNumber}`.replace(/\s+/g, "");
  } else {
    this.fullPhoneNumber = null;
  }
});

module.exports = mongoose.model("User", userSchema);