const express = require("express");
const router = express.Router();
const {
    getMyProfile,
    getUserProfile,
    updateUserProfile,
    deleteAvatar,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


// Get Logged-In User Profile
router.get("/profile", protect, getMyProfile);

// Get Any User Profile
router.get("/:id", getUserProfile);

// Update Logged-In User Profile
router.put("/profile", protect, upload.single("avatar"), updateUserProfile); 

// Follow a User
router.post("/:id/follow", protect, followUser);

// Unfollow a User
router.post("/:id/unfollow", protect, unfollowUser);

// Get Followers
router.get("/:id/followers", protect, getFollowers);

// Get Following
router.get("/:id/following", protect, getFollowing);

router.delete("/profile/avatar", protect, deleteAvatar);

module.exports = router;
