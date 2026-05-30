const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

// Create Post
router.post("/", protect, upload.single("image"), createPost);

// Get Posts
router.get("/", getPosts);

// Like / Unlike
router.put("/:id/like", protect, toggleLike);

// Add Comment
router.post("/:id/comment", protect, addComment);

// Delete Post
router.delete("/:id", protect, deletePost);

module.exports = router;
