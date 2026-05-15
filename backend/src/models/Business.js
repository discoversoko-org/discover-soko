const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    /* =========================
       📌 BASIC INFO
    ========================= */

    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    contact: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    /* =========================
       🖼 IMAGE
    ========================= */

    image: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    /* =========================
       👤 OWNERSHIP
    ========================= */

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       🚦 STATUS FLOW
       (USED BY ADMIN DASHBOARD)
    ========================= */

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    /* =========================
       ⚙️ SYSTEM FLAGS
    ========================= */

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,

    /* =========================
       🔄 RESPONSE CLEANUP
    ========================= */
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

/* =========================
   🚀 OPTIMIZED INDEXES
========================= */

// Admin filtering (MOST IMPORTANT)
businessSchema.index({ status: 1, createdAt: -1 });

// User-owned businesses filtering
businessSchema.index({ owner: 1, status: 1 });

// Category-based search + admin filter
businessSchema.index({ category: 1, status: 1 });

// Location-based search (useful for future search UI)
businessSchema.index({ location: 1, status: 1 });

module.exports = mongoose.model("Business", businessSchema);