const Project = require("../models/Project");
const User = require("../models/User");

// @desc Create a new project
// @route POST /api/projects
// @access Private
const createProject = async (req, res) => {
    try {
        const { title, description, visibility } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Project file is required" });
        }

        const newProject = new Project({
            title,
            description,
            fileUrl: `/uploads/projects/${req.file.filename}`,
            visibility: visibility || "private",
            createdBy: req.user._id,
        });

        await newProject.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: { projects: newProject._id }
        });

        res.status(201).json({ message: "Project uploaded", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};


// @desc Fetch all projects for a user
// @route GET /api/users/:id/projects
// @access Public
const getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.params.id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Pin/Unpin a project
// @route POST /api/projects/:id/pin
// @access Private
const togglePinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to pin this project" });
        }

        project.isPinned = !project.isPinned;
        await project.save();

        res.status(200).json({ message: `Project ${project.isPinned ? "pinned" : "unpinned"} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createProject, getUserProjects, togglePinProject };
