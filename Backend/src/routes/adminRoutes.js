const express = require("express");
const { loginAdmin, createAdmin } = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin Login
router.post("/login", loginAdmin);

// Create a New Admin 
router.post("/create", protect, admin, createAdmin);

module.exports = router;
