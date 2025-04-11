const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllComments,
  deleteComment,
  createNews,
  getAllNews,
  deleteNews,
} = require("../controllers/adminDashboardController");

const { protect, admin } = require("../middlewares/authMiddleware");

// All routes below are protected and require admin access
router.use(protect, admin);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Posts
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);

// Comments
router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteComment);

// News
router.post("/news", createNews);
router.get("/news", getAllNews);
router.delete("/news/:id", deleteNews);

module.exports = router;
