const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const passport = require("../middlewares/googleAuth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    (req, res, next) => {
        console.log("Session before passport:", req.session);
        next();
    },
    passport.authenticate("google", { failureRedirect: "/" }),
    (err, req, res, next) => {
        if (err) {
            console.error("Passport authentication error:", err);
            return res.status(500).json({ error: "Authentication failed" });
        }
        next();
    },
    (req, res) => {
        console.log("Session after passport:", req.session);
        res.json({ message: "Login successful", user: req.user });
    }
);
router.get("/session", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: req.user,
        });
    } else {
        res.json({
            isAuthenticated: false,
        });
    }
});


module.exports = router;
