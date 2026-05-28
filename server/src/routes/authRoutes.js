const express = require("express");

const {
  registerUser,
  loginUser,
  toggleFollow,
  getUserProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Follow / unfollow
router.put("/:id/follow", authMiddleware, toggleFollow);

// Profile route
router.get("/profile/:id", authMiddleware, getUserProfile);

module.exports = router;
