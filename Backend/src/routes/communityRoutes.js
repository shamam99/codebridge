const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getPosts, getPostById, createPost, updatePost, deletePost, toggleSavePost } = require("../controllers/communityController");

const router = express.Router();

// Community Routes here
router.get("/",  getPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/save", protect, toggleSavePost);

module.exports = router;
