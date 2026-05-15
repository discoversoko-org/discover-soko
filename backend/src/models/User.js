const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* 📌 Basic Info */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password
    },

    /* 📌 Avatar (Cloudinary-ready structure) */
    avatar: {
      url: {
        type: String,
        default:
          "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    /* 📌 Role */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    /* 📌 Relationships */
    businesses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
    toObject: { virtuals: true },
  }
);



/* ✅ VIRTUAL: Return avatar URL directly */
userSchema.virtual("avatarUrl").get(function () {
  return this.avatar && this.avatar.url;
});



module.exports = mongoose.model("User", userSchema);