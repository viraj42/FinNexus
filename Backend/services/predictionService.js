// services/predictionService.js

const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Correct regression import
const { SimpleLinearRegression } = require("ml-regression");

/* ============================================================
   STEP 1 — GET MONTHLY TOTAL EXPENSES (Last N Months)
============================================================ */
async function getMonthlyExpenseHistory(userId, months = 6) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const historyAgg = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "expense",
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        total: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // Normalize into continuous months
  const result = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;

    const row = historyAgg.find(r => r._id.year === y && r._id.month === m);

    result.push({
      year: y,
      month: m,
      total: row ? row.total : 0
    });
  }

  return result;
}

/* ============================================================
   STEP 2 — APPLY LINEAR REGRESSION
============================================================ */
function applyRegression(history) {
  const x = [];
  const y = [];

  history.forEach((entry, idx) => {
    x.push(idx);
    y.push(entry.total);
  });

  // Minimum 2 points needed
  if (x.length < 2) {
    return {
      predicted: y[y.length - 1] || 0,
      slope: 0,
      intercept: y[0] || 0,
      confidence: 0,
      method: "insufficient-data"
    };
  }

  // Regression works correctly with this library
  const regression = new SimpleLinearRegression(x, y);

  const slope = regression.slope;
  const intercept = regression.intercept;

  const nextIndex = x.length;
  const predicted = regression.predict(nextIndex);

  // Compute R² confidence score
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  const ssRes = y.reduce((sum, yi, i) => sum + (yi - regression.predict(i)) ** 2, 0);
  const ssTot = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  return {
    predicted: predicted < 0 ? 0 : predicted,
    slope,
    intercept,
    confidence: r2,
    method: "linear-regression"
  };
}

/* ============================================================
   STEP 3 — MAIN FUNCTION
============================================================ */
async function getExpensePrediction(userId, months = 6) {
  const history = await getMonthlyExpenseHistory(userId, months);
  const regressionResult = applyRegression(history);

  return {
    history,
    ...regressionResult
  };
}

module.exports = {
  getMonthlyExpenseHistory,
  getExpensePrediction
};
