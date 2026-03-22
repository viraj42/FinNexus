const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

//
// GET ALL CATEGORIES (Default + User Categories)
// ----------------------------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user-specific categories
    const userCategories = await Category.find({ userId }).sort({ name: 1 });

    // Fetch default categories (userId = null)
    const defaultCategories = await Category.find({ userId: null }).sort({ name: 1 });

    const all = [...defaultCategories, ...userCategories];

    res.status(200).json({
      message: "Categories fetched successfully",
      categories: all,
    });

  } catch (error) {
    console.error("Category Fetch Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//
// CREATE NEW CATEGORY (User category)
// ----------------------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = await Category.create({
      userId,
      name,
      icon: icon || "default-icon",
      color: color || "#000000",
      isDefault: false,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });

  } catch (error) {
    console.error("Category Creation Error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

//
// DELETE CATEGORY (User-owned only)
// ----------------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prevent deleting default categories
    if (category.isDefault || category.userId === null) {
      return res.status(403).json({ message: "Default categories cannot be deleted" });
    }

    // Prevent deleting other user's categories
    if (category.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: "Category deleted successfully" });

  } catch (error) {
    console.error("Category Delete Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
