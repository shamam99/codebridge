const mongoose = require("mongoose");

const CodePageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Code title is required."],
      minlength: [3, "Title must be at least 3 characters."],
      maxlength: [100, "Title cannot exceed 100 characters."],
      trim: true,
    },
    language: {
      type: String,
      required: [true, "Programming language is required."],
      enum: {
        values: ["python", "javascript", "java", "cpp", "csharp"],
        message: "Unsupported language selected.",
      },
    },
    content: {
      type: String,
      default: "",
      maxlength: [10000, "Code content is too long (max 10,000 characters)."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Code page must be linked to a user."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CodePage", CodePageSchema);
