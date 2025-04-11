const express = require("express");
const router = express.Router();
const { createProject, getUserProjects, togglePinProject } = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Upload project
router.post("/", protect, upload.single("projectFile"), createProject);

// Get all projects for a user
router.get("/users/:id/projects", getUserProjects);

// Pin/Unpin project
router.post("/:id/pin", protect, togglePinProject);

module.exports = router;
