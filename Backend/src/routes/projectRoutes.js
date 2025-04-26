const express = require("express");
const router = express.Router();
const { createProject, getUserProjects, togglePinProject, updateProject, deleteProject, toggleStarProject, getStarredProjects} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Upload project
router.post("/", protect, upload.single("projectFile"), createProject);

// Get all projects for a user
router.get("/users/:id/projects", getUserProjects);

// Pin/Unpin project
router.post("/:id/pin", protect, togglePinProject);

router.put("/:id", protect, updateProject);

// Delete project
router.delete("/:id", protect, deleteProject);

// Star/Unstar project
router.post("/:id/star", protect, toggleStarProject);

// Get starred projects
router.get("/users/:id/starred", protect, getStarredProjects);

module.exports = router;
