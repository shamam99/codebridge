const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "News title is required."],
    minlength: [5, "Title must be at least 5 characters."],
    maxlength: [200, "Title cannot exceed 200 characters."],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "News content is required."],
    minlength: [20, "Content must be at least 20 characters."],
    maxlength: [5000, "Content cannot exceed 5000 characters."],
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // optional but still tracked
  },
});

// Format output
NewsSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("News", NewsSchema);
