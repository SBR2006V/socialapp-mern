const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers || [],
        following: user.following || [],
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers || [],
        following: user.following || [],
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Follow / Unfollow User
const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const targetUserId = req.params.id;

    // Prevent self follow
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const currentUser = await User.findById(currentUserId);

    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Safe arrays
    currentUser.following = currentUser.following || [];

    targetUser.followers = targetUser.followers || [];

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === targetUserId,
    );

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId,
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId,
      );
    } else {
      // Avoid duplicate follow
      if (!currentUser.following.some((id) => id.toString() === targetUserId)) {
        currentUser.following.push(targetUserId);
      }

      if (!targetUser.followers.some((id) => id.toString() === currentUserId)) {
        targetUser.followers.push(currentUserId);
      }
    }

    await currentUser.save();
    await targetUser.save();

    // DEBUG
    console.log("FOLLOW STATUS:", {
      currentUser: currentUser.username,
      targetUser: targetUser.username,
      followers: targetUser.followers.length,
      following: currentUser.following.length,
    });

    res.status(200).json({
      message: isFollowing ? "User unfollowed" : "User followed",

      following: !isFollowing,

      followersCount: targetUser.followers.length,

      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error("FOLLOW ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  toggleFollow,
};
