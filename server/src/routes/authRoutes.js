const express = require("express");

const {
  registerUser,
  loginUser,
  followUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Follow / Unfollow User
router.put("/:id/follow", protect, followUser);

module.exports = router;
