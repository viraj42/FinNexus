const User = require("../models/User");
const Category = require("../models/category");

module.exports.completeOnboarding = async (req, res) => {
  try {
    const { monthlyIncome, monthlyBudget, spendingPreferences, role } = req.body;
    const userId = req.userId;

    // 1. Update user onboarding fields
    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
        monthlyIncome,
        monthlyBudget,
        spendingPreferences,
        onboardingCompleted: true,
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Create custom categories from preferences
    if (Array.isArray(spendingPreferences)) {
      const categoriesToInsert = spendingPreferences.map((name) => ({
        name,
        userId,
        icon: "default-icon",
        color: "#000000",
        isDefault: false,
      }));

      await Category.insertMany(categoriesToInsert);
    }

    return res.json({
      message: "Onboarding completed successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
