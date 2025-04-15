const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post ID is required."],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required."],
  },
  content: {
    type: String,
    required: [true, "Comment content is required."],
    minlength: [1, "Comment cannot be empty."],
    maxlength: [1000, "Comment cannot exceed 1000 characters."],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Output formatting
CommentSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
