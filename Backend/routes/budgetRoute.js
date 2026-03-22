const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const budgetController = require("../controllers/budgetController");

// Set or update monthly budget + currency
router.put("/", authMiddleware,budgetController.updateBudget);

// Get budget status (spent, remaining, usage %)
router.get("/status", authMiddleware, budgetController.getBudgetStatus);

module.exports = router;
