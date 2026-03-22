const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(email);

    // 🔒 Basic validation (non-breaking)
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    // 🔥 Normalize email (important for consistency)
    const normalizedEmail = email.toLowerCase().trim();

    // 🔥 Password hashing (same as before)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser;

    try {
      // ✅ SINGLE DB CALL (no pre-check)
      newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      });
    } catch (err) {
      // 🔥 HANDLE DUPLICATE EMAIL (race-condition safe)
      if (err.code === 11000) {
        return res.status(400).json({
          error: "User already exists"
        });
      }
      throw err;
    }

    console.log("Created!!");

    // 🔐 Token generation unchanged
    const token = generateToken(newUser._id);

    // ✅ RESPONSE — EXACT SAME STRUCTURE (frontend safe)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};

/* --------------------------------------------------
   LOGIN
-------------------------------------------------- */
/* --------------------------------------------------
   LOGIN (OPTIMIZED + SAFE + COMPATIBLE)
-------------------------------------------------- */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔒 Basic validation (non-breaking)
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // 🔥 Normalize email (IMPORTANT)
    const normalizedEmail = email.toLowerCase().trim();

    // ⚡ Optimized query (fetch only required fields)
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔐 Password check
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    console.log("Logged In!!");

    const token = generateToken(user._id);

    // ✅ SAME RESPONSE STRUCTURE (frontend safe)
    return res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        monthlyIncome: user.monthlyIncome,
        monthlyBudget: user.monthlyBudget,
        spendingPreferences: user.spendingPreferences,
        onboardingCompleted: user.onboardingCompleted,
        currency: user.currency,
      },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      error: error.message
    });
  }
};
/* --------------------------------------------------
   LOGOUT
-------------------------------------------------- */
module.exports.logout = (req, res) => {
  // JWT logout means token is removed client-side.
  console.log("user logged out");
  
  return res.json({ message: "Logged out successfully" });
};

/* --------------------------------------------------
   GET CURRENT LOGGED-IN USER
-------------------------------------------------- */
module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log(user);
    
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* --------------------------------------------------
   GET USER BY ID
-------------------------------------------------- */
module.exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* --------------------------------------------------
   UPDATE USER PROFILE
-------------------------------------------------- */
module.exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, monthlyBudget, currency } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, role, monthlyBudget, currency },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
