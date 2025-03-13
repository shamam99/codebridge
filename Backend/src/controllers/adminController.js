const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Login as Admin
// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        res.json({
            message: "Admin login successful",
            adminId: admin._id,
            token: generateToken(admin),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Create a New Admin
// @route POST /api/admin/create
// @access Admin Only
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await User.findOne({ email });
        if (adminExists) return res.status(400).json({ error: "Email already in use" });

        const newAdmin = await User.create({ name, email, password, role: "admin" });

        res.status(201).json({
            message: "Admin created successfully",
            adminId: newAdmin._id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { loginAdmin, createAdmin };
