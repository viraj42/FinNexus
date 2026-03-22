// controllers/predictionController.js

const { getExpensePrediction } = require("../services/predictionService");
const User = require("../models/User");

/* ============================================================
   PREDICT NEXT MONTH EXPENSE
   Route: GET /api/prediction/next-month
   Auth Required
============================================================ */
exports.predictNextMonthExpense = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Safe months handling
    const monthsRaw = parseInt(req.query.months);
    const months =
      !isNaN(monthsRaw) && monthsRaw > 0 && monthsRaw <= 12
        ? monthsRaw
        : 6;

    // ✅ Fetch user
    const user = await User.findById(userId).select("currency");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currency = user.currency || "INR";

    // ✅ Prediction service
    const prediction = await getExpensePrediction(userId, months);

    // ✅ Safe fallback
    if (!prediction || prediction.predicted == null) {
      return res.status(200).json({
        success: true,
        currency,
        history: [],
        predicted: 0,
        slope: 0,
        intercept: 0,
        confidence: 0,
        method: "insufficient_data"
      });
    }

    return res.status(200).json({
      success: true,
      currency,
      history: prediction.history || [],
      predicted: Number(prediction.predicted.toFixed(2)),
      slope: prediction.slope,
      intercept: prediction.intercept,
      confidence: Number((prediction.confidence || 0).toFixed(2)),
      method: prediction.method || "linear_regression"
    });

  } catch (error) {
    console.error("Prediction Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate prediction",
      error: error.message
    });
  }
};