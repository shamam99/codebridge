const Comment = require("../models/Comment");

// @desc Get all comments for a specific post
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name avatar")
      .sort({ timestamp: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get comments", error });
  }
};

// @desc Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    console.log("Backend received:", { postId, content, userId: req.user._id });

    const comment = await Comment.create({
      postId,
      userId: req.user._id,
      content,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment", error });
  }
};

// @desc Update a comment (user only)
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    comment.content = req.body.content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error });
  }
};

// @desc Delete a comment (user only)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.userId.toString() !== req.user._id?.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
};
