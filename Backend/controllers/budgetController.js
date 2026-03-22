const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/* ========================================================
   UPDATE MONTHLY BUDGET
======================================================== */
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { monthlyBudget, currency } = req.body;

    if (monthlyBudget < 0) {
      return res.status(400).json({ message: "Monthly budget cannot be negative" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        monthlyBudget,
        currency: currency || "INR",
      },
      { new: true }
    ).select("-passwordHash");

    return res.status(200).json({
      message: "Budget updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Budget Update Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ========================================================
   GET BUDGET STATUS (CURRENT MONTH EXPENSES)
======================================================== */
exports.getBudgetStatus = async (req, res) => {
  try {
    const userId = req.userId;

    // Get budget + currency of logged-in user
    const user = await User.findById(userId).select("monthlyBudget currency");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { monthlyBudget, currency } = user;

    // If no budget set yet, return defaults
    if (!monthlyBudget || monthlyBudget === 0) {
      return res.status(200).json({
        monthlyBudget: 0,
        totalSpent: 0,
        remaining: 0,
        usagePercent: 0,
        currency: currency || "INR",
        overshootRisk: false,
      });
    }

    // ---- Get current month range ----
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);  // 1st of month
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of month

    // ---- EXPENSE SUM AGGREGATION ----
    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),  // FIXED
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    
    const totalSpent = expenseAgg.length > 0 ? expenseAgg[0].total : 0;

    // ---- Calculations ----
    const remaining = monthlyBudget - totalSpent;
    const usagePercent = ((totalSpent / monthlyBudget) * 100).toFixed(2);

    return res.status(200).json({
      monthlyBudget,
      totalSpent,
      remaining,
      usagePercent,
      currency,
      overshootRisk: remaining < 0, // true if spent more than budget
    });

  } catch (error) {
    console.error("Budget Status Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
