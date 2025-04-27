const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required."],
    minlength: [2, "Title must be at least 3 characters long."],
    maxlength: [50, "Title must be under 300 characters."],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required."],
    minlength: [2, "Content must be at least 2 characters long."],
    maxlength: [3000, "Content cannot exceed 3000 characters."],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Transform output
PostSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Post", PostSchema);
