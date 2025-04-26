const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import the Project model
require("./Project");

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: function (v) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: "Name must contain only letters and spaces.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /.+@.+\..+/.test(v);
      },
      message: "Invalid email format.",
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6,
    validate: {
      validator: function (v) {
        if (!v) return true; // Skip if using Google
        return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(v);
      },
      message: "Password must contain at least one letter and one number.",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
    maxlength: 200,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  company: {
    type: String,
    default: null,
    maxlength: 100,
  },
  location: {
    type: String,
    default: null,
    maxlength: 100,
  },
  socialMediaLinks: [
    {
      platform: { type: String },
      url: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || urlRegex.test(v);
          },
          message: "Invalid URL format.",
        },
      },
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  starredProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
