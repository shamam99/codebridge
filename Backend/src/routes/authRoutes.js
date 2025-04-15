const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const passport = require("../middlewares/googleAuth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


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
