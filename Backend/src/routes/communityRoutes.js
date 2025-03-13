const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/communityController");

const router = express.Router();

// Community Routes
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
