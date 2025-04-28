const Project = require("../models/Project");
const User = require("../models/User");

// @desc Create a new project
// @route POST /api/projects
// @access Private
const createProject = async (req, res) => {
  try {
      const { title, description } = req.body;
      const visibility = req.body.visibility || "private";  
      if (!["public", "private"].includes(visibility)) {
        visibility = "private";
      }

      if (!req.file) {
          return res.status(400).json({ message: "Project file is required" });
      }

      const newProject = new Project({
          title,
          description,
          fileUrl: `/uploads/projects/${req.file.filename}`,
          visibility,  
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
    const requestedUserId = req.params.id;
    const currentUserId = req.user ? req.user._id.toString() : null;

    let query = { createdBy: requestedUserId };

    if (!currentUserId || currentUserId !== requestedUserId) {
      query.visibility = "public";
    }

    const projects = await Project.find(query);
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

const updateProject = async (req, res) => {
    try {
      const { title, description } = req.body;
  
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      if (project.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      project.title = title || project.title;
      project.description = description || project.description;
  
      await project.save();
      res.status(200).json({ message: "Project updated", project });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // Delete project
  const deleteProject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      if (project.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this project" });
      }
  
      await project.remove();
  
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { projects: project._id },
      });
  
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

const toggleStarProject = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const projectId = req.params.id;
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const alreadyStarred = user.starredProjects.includes(projectId);
  
      if (alreadyStarred) {
        user.starredProjects = user.starredProjects.filter((id) => id.toString() !== projectId);
      } else {
        user.starredProjects.push(projectId);
      }
  
      await user.save();
      res.status(200).json({ message: alreadyStarred ? "Project unstarred" : "Project starred" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  const getStarredProjects = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate("starredProjects");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user.starredProjects);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  module.exports = {
    createProject,
    getUserProjects,
    togglePinProject,
    updateProject,
    deleteProject,
    toggleStarProject,
    getStarredProjects

  };
