const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /* DESCRIPTION */
    description: {
      type: String,
      default: "",
      trim: true,
    },

    /* CONTACT / WHATSAPP */
    whatsapp: {
      type: String,
      default: "",
      trim: true,
    },

    tag: {
      type: String,
      default: "",
    },

    image: {
      url: {
        type: String,
        required: true,
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    linkText: {
      type: String,
      default: "View",
    },

    link: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,

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

module.exports = mongoose.model(
  "HeroSlide",
  heroSlideSchema
);