const express = require("express");
const router = express.Router();


const preferenceController = require("../controllers/onBoardingController");
const authMiddleware = require("../middleware/authMiddleware");
router.post('/',authMiddleware,preferenceController.completeOnboarding);

module.exports=router;