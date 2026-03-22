const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Category = require("../models/category");
const User = require("../models/User");

/* ============================================================
   SECTION 1 — MONTHLY OVERVIEW SUMMARY
============================================================ */
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const user = await User.findById(req.userId).select("monthlyIncome");
    const userMonthlyIncome = user?.monthlyIncome || 0;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const summaryAgg = await Transaction.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    const incomeObj = summaryAgg.find(x => x._id === "income");
    const expenseObj = summaryAgg.find(x => x._id === "expense");

    const totalIncome = incomeObj ? incomeObj.total : 0;
    const totalExpense = expenseObj ? expenseObj.total : 0;

    const topCategoryAgg = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          type: "expense", 
          date: { $gte: start, $lte: end } 
        }
      },
      {
        $group: {
          _id: { $ifNull: ["$categoryId", "UNKNOWN"] },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    let topCategory = null;

    if (topCategoryAgg.length > 0) {
      let catDoc = null;

      if (topCategoryAgg[0]._id !== "UNKNOWN") {
        catDoc = await Category.findById(topCategoryAgg[0]._id).select("name");
      }

      topCategory = {
        name: catDoc?.name || "Unknown",
        amount: topCategoryAgg[0].total
      };
    }

    return res.status(200).json({
      totalIncome,
      totalExpense,
      userMonthlyIncome,
      netSavings: totalIncome - totalExpense, 
      topCategory
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999); // ✅ safer end range

    const breakdownAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $ifNull: ["$categoryId", "UNKNOWN"] },
          total: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalSpent = breakdownAgg.reduce((sum, c) => sum + c.total, 0);

    const final = breakdownAgg.map((item) => ({
      categoryId: item._id,
      name: item.category?.name || "Unknown",
      icon: item.category?.icon || "",
      color: item.category?.color || "",
      amount: item.total,
      percentage:
        totalSpent === 0
          ? 0
          : ((item.total / totalSpent) * 100).toFixed(1)
    }));

    return res.status(200).json({
      totalSpent,
      categories: final
    });

  } catch (error) {
    console.error("Category Breakdown Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


/* ============================================================
   SECTION 3 — MONTHLY TREND (LAST 12 MONTHS)
============================================================ */
exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const trendAgg = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          date: { $gte: start }
        }
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
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const trend = trendAgg.map((t) => ({
      month: `${t._id.month}-${t._id.year}`,
      total: t.total
    }));

    return res.status(200).json({ trend });

  } catch (error) {
    console.error("Monthly Trend Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
