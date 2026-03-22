const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
    },

  categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: function () {
    return this.type === "expense";
  },
},



    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank", "wallet", "other"],
      default: "other",
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    tags: {
      type: [String], // removed trim (invalid on array)
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*------------------------------------------
  IMPORTANT INDEXES
-------------------------------------------*/
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });

// NEW (Useful for analytics for type-based filtering)
transactionSchema.index({ userId: 1, type: 1 });

transactionSchema.index({
  userId: 1,
  date: -1,
  type: 1
});

module.exports = mongoose.model("Transaction", transactionSchema);
