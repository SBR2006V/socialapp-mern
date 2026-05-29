const express = require("express");

const {
  registerUser,
  loginUser,
  toggleFollow,
  getUserProfile,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Follow / Unfollow
router.put("/:id/follow", authMiddleware, toggleFollow);

// Get profile
router.get("/profile/:id", authMiddleware, getUserProfile);

// Update profile
router.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile,
);

module.exports = router;
