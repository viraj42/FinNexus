// routes/predictionRoute.js

const express = require("express");
const router = express.Router();

// Your auth middleware (same used in transactions, budget, analytics)
const authMiddleware = require("../middleware/authMiddleware");

const {
  predictNextMonthExpense
} = require("../controllers/predictionController");


// ------------------------------------------------------------
// GET /api/prediction/next-month
// Predict next month expense using regression
// ------------------------------------------------------------
router.get(
  "/next-month",
  authMiddleware,         // ensures userId is available
  predictNextMonthExpense
);

module.exports = router;
