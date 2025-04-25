const express = require("express");
const { translateCodeHandler, getTranslationHistory, getLanguages, runCodeHandler, debugCode } = require("../controllers/translateController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Translate Code
router.post("/", protect, translateCodeHandler);

// Get Translation History
router.get("/history", protect, getTranslationHistory);

// Get available programming languages
router.get("/languages", getLanguages);

// Run Code
router.post("/run", runCodeHandler);

// Debug Code
router.post("/debug", debugCode);


module.exports = router;
