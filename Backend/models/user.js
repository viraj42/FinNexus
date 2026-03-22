const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic login fields
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Onboarding screen 1
    role: {
      type: String,
      enum: ['student', 'working', 'farmer', 'household', 'other'],
      default: 'other',
    },

    // Onboarding screen 2
    monthlyIncome: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Onboarding screen 3
    monthlyBudget: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Onboarding screen 4
    spendingPreferences: {
      type: [String],   // ['food','transport','shopping']
      default: [],
    },

    // Currency
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },

    // Track onboarding completion
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ email: 1, passwordHash: 1 });
module.exports = mongoose.model('User', userSchema);
