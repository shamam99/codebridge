const Project = require("../models/Project");
const User = require("../models/User");

// @desc Create a new project
// @route POST /api/projects
// @access Private
const createProject = async (req, res) => {
    try {
        const { title, description, projectUrl } = req.body;

        const newProject = new Project({
            title,
            description,
            projectUrl,
            createdBy: req.user._id,
        });

        await newProject.save();

        const user = await User.findById(req.user._id);
        user.projects.push(newProject._id);
        await user.save();

        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
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
