const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User who created the project
        required: true,
    },
    isPinned: {
        type: Boolean,
        default: false, // Whether the project is pinned
    },
    projectUrl: {
        type: String,
        default: null, // Optional URL for the project
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Project", ProjectSchema);
