const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import the Project model
require("./Project");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            // Make password required only if not an OAuth user
            return !this.googleId;
        },
    },
    googleId: {
        type: String, // Store Google ID for OAuth users
        default: null,
    },
    username: {
        type: String,
        unique: true, // To ensure usernames are unique
        default: null,
    },
    avatar: {
        type: String, // URL to the avatar image
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to other users
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to other users
        },
    ],
    company: {
        type: String,
        default: null,
    },
    location: {
        type: String, // Could be enhanced with a predefined list of countries
        default: null,
    },
    socialMediaLinks: [
        {
            platform: { type: String }, //"LinkedIn", "GitHub", etc.
            url: { type: String },
        },
    ],
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", // Reference to the Project model
        },
    ],
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
