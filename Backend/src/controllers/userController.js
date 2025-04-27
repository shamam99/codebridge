const User = require("../models/User");
const multer = require("multer");
const fs = require("fs");

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });


// @desc Get logged-in user profile
// @route GET /api/users/profile
// @access Private
const getMyProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
        .populate("followers", "name username avatar")
        .populate("following", "name username avatar")
        .populate("projects", "title description");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.description,
        location: user.location,
        company: user.company,
        socialLinks: user.socialMediaLinks, 
        followers: user.followers,
        following: user.following,
        projects: user.projects,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  


// @desc Get a user's profile
// @route GET /api/users/:id
// @access Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("followers", "name username avatar")
            .populate("following", "name username avatar")
            .populate("projects", "title description");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            company: user.company,
            socialLinks: user.socialLinks,
            followers: user.followers, 
            following: user.following, 
            projects: user.projects,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const { name, bio, location, company, socialLinks } = req.body;
  
      if (name) user.name = name;
      if (bio) user.description = bio;
      if (location) user.location = location;
      if (company) user.company = company;
      if (socialLinks) user.socialMediaLinks = JSON.parse(socialLinks);
  
      //  Handle Avatar Upload (from file)
      if (req.file) {
        const base64Image = req.file.buffer.toString("base64");
        user.avatar = `data:${req.file.mimetype};base64,${base64Image}`;
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          bio: updatedUser.description,
          location: updatedUser.location,
          company: updatedUser.company,
          socialLinks: updatedUser.socialMediaLinks,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const deleteAvatar = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.avatar = null;
      await user.save();
      res.status(200).json({ message: "Avatar removed successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to remove avatar", error: err.message });
    }
  };
  
  
// @desc Follow a user
// @route POST /api/users/:id/follow
// @access Private
const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userToFollow.followers.includes(currentUser._id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        userToFollow.followers.push(currentUser._id);
        currentUser.following.push(userToFollow._id);

        await userToFollow.save();
        await currentUser.save();

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Unfollow a user
// @route POST /api/users/:id/unfollow
// @access Private
const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userToUnfollow.followers.includes(currentUser._id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(
            (followerId) => followerId.toString() !== currentUser._id.toString()
        );
        currentUser.following = currentUser.following.filter(
            (followingId) => followingId.toString() !== userToUnfollow._id.toString()
        );

        await userToUnfollow.save();
        await currentUser.save();

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get followers of a user
// @route GET /api/users/:id/followers
// @access Private
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "name username avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get users a user is following
// @route GET /api/users/:id/following
// @access Private
const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("following", "name username avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// /controllers/userController.js
const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: { path: "userId", select: "name avatar" }
    });
    res.json(user.savedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error loading saved posts", error });
  }
};


module.exports = { getMyProfile, getUserProfile, updateUserProfile, deleteAvatar, followUser, unfollowUser, getFollowers, getFollowing, getSavedPosts};
