const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const { getNews, getNewsById, createNews, deleteNews } = require("../controllers/newsController");

const router = express.Router();

// News Routes
router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", protect, admin, createNews);
router.delete("/:id", protect, admin, deleteNews);

module.exports = router;
