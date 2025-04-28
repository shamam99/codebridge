const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Register User
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: "Email already in use" });
  
      const newUser = await User.create({ name, email, password });
  
      res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id,
        token: generateToken(newUser),
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({ error: messages.join(". ") });
      }
  
      res.status(500).json({ error: error.message });
    }
  };
  

// @desc Login User
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        if (!user.isActive) {
          user.isActive = true;
          await user.save();
        }
        
        res.json({
            message: "Login successful",
            userId: user._id,
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };
