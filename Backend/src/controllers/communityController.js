const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// @desc Fetch All Posts with Comment Count
// @route GET /api/community
// @access Private
const getPosts = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    let posts;

    if (req.user) {
      // logged-in user here
      const userId = req.user._id;
      const user = await User.findById(userId).select("following");
      const followingIds = user.following;
      const visibleUserIds = [...followingIds, userId];

      posts = await Post.find({
        userId: { $in: visibleUserIds },
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ],
      })
      .populate("userId", "name avatar")
      .sort({ timestamp: -1 });

    } else {
      // visitor
      posts = await Post.find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ],
      })
      .populate("userId", "name avatar")
      .sort({ timestamp: -1 });
    }

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);

    const commentCountMap = {};
    commentCounts.forEach((c) => {
      commentCountMap[c._id.toString()] = c.count;
    });

    const postsWithCommentCounts = posts.map((p) => ({
      ...p.toObject(),
      commentCount: commentCountMap[p._id.toString()] || 0,
    }));

    res.json(postsWithCommentCounts);

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to load posts", error: error.message });
  }
};



// @desc Fetch Post by ID
// @route GET /api/community/:id
// @access Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// @desc Create a New Post
// @route POST /api/community
// @access Private
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ userId: req.user._id, title, content });
  res.status(201).json(post);
};

// @desc Update a Post
// @route PUT /api/community/:id
// @access Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

// @desc Delete a Post
// @route DELETE /api/community/:id
// @access Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

// @desc Save or Unsave Post
// @route POST /api/community/:id/save
// @access Private
const toggleSavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;
    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts.pull(postId);
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.status(200).json({ saved: !isSaved });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle save", error: err });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleSavePost,
};
