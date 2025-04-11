const express = require("express");
const {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
} = require("../controllers/newsController");

const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public
router.get("/", getNews);
router.get("/:id", getNewsById);

// Admin Only
router.post("/", protect, admin, createNews);
router.put("/:id", protect, admin, updateNews);
router.delete("/:id", protect, admin, deleteNews);

module.exports = router;
