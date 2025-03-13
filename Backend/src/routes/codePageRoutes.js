const express = require("express");
const { createCodePage, getCodePages, deleteCodePage } = require("../controllers/codePageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new code page
router.post("/", protect, createCodePage);

// Get all code pages
router.get("/", protect, getCodePages);

// Delete a code page
router.delete("/:id", protect, deleteCodePage);

module.exports = router;
