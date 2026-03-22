const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMonthlySummary,
  getCategoryBreakdown,
  getMonthlyTrend
} = require("../controllers/analyticsController");

// Section 1: Overview Stats
router.get("/summary", authMiddleware, getMonthlySummary);

// Section 2: Category Breakdown (Pie Chart)
router.get("/category-breakdown", authMiddleware, getCategoryBreakdown);

// Section 3: Monthly Trend 
router.get("/monthly-trend", authMiddleware, getMonthlyTrend);

module.exports = router;
