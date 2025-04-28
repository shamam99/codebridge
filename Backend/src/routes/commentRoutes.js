const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.get("/post/:postId",  getCommentsByPost);
router.post("/", protect, createComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
