const Transaction = require("../models/Transaction");

// -----------------------------
// CREATE TRANSACTION
// -----------------------------
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.userId;

    if (req.body.type === "expense" && !req.body.categoryId) {
      return res.status(400).json({
        message: "Category is required for expense transactions",
      });
    }

    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map(t => t.trim());
    }

    const newTx = await Transaction.create({
      userId,
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    });

    const populatedTx = await newTx.populate("categoryId", "name icon color");

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: populatedTx,
    });

  } catch (error) {
    console.error("Transaction Create Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// -----------------------------
// FETCH TRANSACTIONS
// -----------------------------
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, categoryId, type, paymentMethod } = req.query;

    const filter = { userId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      filter.date = { $gte: start, $lte: end };
    }

    if (categoryId) filter.categoryId = categoryId;
    if (type) filter.type = type;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const transactions = await Transaction.find(filter)
      .populate("categoryId", "name icon color")
      .sort({ date: -1 });

    res.status(200).json({ transactions });

  } catch (error) {
    console.error("Get Transactions Error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// -----------------------------
// UPDATE TRANSACTION
// -----------------------------
exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (req.body.type === "expense" && !req.body.categoryId) {
      return res.status(400).json({
        message: "Category is required for expense transactions",
      });
    }

    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map(t => t.trim());
    }

    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    ).populate("categoryId", "name icon color");

    if (!updatedTx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTx,
    });

  } catch (error) {
    console.error("Update Transaction Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// -----------------------------
// DELETE TRANSACTION
// -----------------------------
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deletedTx = await Transaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedTx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error("Delete Transaction Error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
