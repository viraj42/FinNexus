const express = require("express");
const router = express.Router();

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE
router.post("/", authMiddleware, createTransaction);

// GET ALL (with filters)
router.get("/", authMiddleware, getTransactions);

// UPDATE
router.put("/:id", authMiddleware, updateTransaction);

// DELETE
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
