const express = require("express");
const router = express.Router();
const { createProject, getUserProjects, togglePinProject } = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

// Create a new project
router.post("/", protect, createProject);

// Fetch all projects for a user
router.get("/users/:id/projects", getUserProjects);

// Pin/Unpin a project
router.post("/:id/pin", protect, togglePinProject);

// Pin/Unpin a project
router.post("/:id/unpin", protect, togglePinProject);

module.exports = router;
