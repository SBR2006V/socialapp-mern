const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  toggleFollow,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Follow / Unfollow
router.put("/:id/follow", protect, toggleFollow);

module.exports = router;
