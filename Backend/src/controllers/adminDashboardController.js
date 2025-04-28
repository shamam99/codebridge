const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const News = require("../models/News");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Toggle user active/inactive
const toggleUserActiveStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "userId",
      match: { isActive: true }, 
      select: "name email"
    });
    const filteredPosts = posts.filter(post => post.userId !== null);

    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: "userId",
        match: { isActive: true }, 
        select: "name"
      })
      .populate({
        path: "postId",
        select: "content"
      });
      const filteredcomments = comments.filter(comment => comment.userId !== null);

      res.json(filteredcomments);
    } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      await comment.deleteOne();
      res.json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
  };

// Create news
const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.create({ title, content });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to create news", error: error.message });
  }
};

// Get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ timestamp: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to get news", error: error.message });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  toggleUserActiveStatus,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
  createNews,
  getAllNews,
  deleteNews,
};
