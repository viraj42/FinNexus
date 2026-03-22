const express = require("express");
const router = express.Router();

const userController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.get('/',(req,res)=>{
    res.send('hii');
})
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected Routes
router.get("/me", authMiddleware, userController.getCurrentUser);
router.get("/:id", authMiddleware, userController.getUserProfile);
router.put("/:id", authMiddleware, userController.updateProfile);

// Logout
router.post("/logout", userController.logout);

module.exports = router;
