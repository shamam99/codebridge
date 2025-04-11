const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify token and user role
const protect = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Make sure to include the role in req.user
        const user = await User.findById(decoded.id);
  
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
  
        req.user = user; 
        next();
      } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Not authorized, token failed" });
      }
    }
  
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }
};

// Middleware to restrict to admin only
const admin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied, admin only" });
    }
    next();
};

module.exports = { protect, admin };
