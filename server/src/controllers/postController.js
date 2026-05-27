const Post = require("../models/Post");

// Create Post
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const image = req.file?.path || "";

    // Prevent empty post
    if (!content?.trim() && !image) {
      return res.status(400).json({
        message: "Post cannot be empty",
      });
    }

    const post = await Post.create({
      user: req.user._id,
      content: content || "",
      image,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username",
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create Post Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username followers following profilePic bio")
      .populate("comments.user", "username")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Like / Unlike Post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "username")
      .populate("comments.user", "username");

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
};
