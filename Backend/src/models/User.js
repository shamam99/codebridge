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
            return !this.googleId;
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
    username: {
        type: String,
        unique: true, 
        default: null,
    },
    avatar: {
        type: String, 
        default: null,
    },
    description: {
        type: String,
        default: null,
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
    },
    location: {
        type: String, 
        default: null,
    },
    socialMediaLinks: [
        {
            platform: { type: String }, 
            url: { type: String },
        },
    ],
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project", 
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
