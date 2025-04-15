const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required."],
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [100, "Title cannot exceed 100 characters."],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters."],
    },
    fileUrl: {
      type: String,
      required: [true, "A file URL is required."],
      match: [/^\/uploads\/projects\/.*\.zip$/, "Invalid file path or format."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must be associated with a user."],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: {
        values: ["public", "private"],
        message: "Visibility must be either 'public' or 'private'.",
      },
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
