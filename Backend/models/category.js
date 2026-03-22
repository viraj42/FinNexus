const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = global default categories
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    icon: {
      type: String,
      default: "default-icon",
      trim: true,
      maxlength: 100,
    },

    color: {
      type: String,
      default: "#000000",
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for fast category lookup
categorySchema.index({ userId: 1 });

module.exports = mongoose.model("Category", categorySchema);
