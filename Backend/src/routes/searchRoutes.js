const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Search for users and posts
// @route   GET /api/search
// @access  Public
router.get('/', async (req, res) => {
  const { q } = req.query;

  try {
    let users = [];
    let posts = [];

    if (q && q.trim()) {
      users = await User.find({
        isActive: true, 
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { username: { $regex: q, $options: 'i' } }
        ]
      }).select('name username avatar');

      posts = await Post.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ]
      }).populate('userId', 'name username avatar').sort({ timestamp: -1 });

    } else {
      // No search query
      posts = await Post.find()
        .populate('userId', 'name username avatar')
        .sort({ timestamp: -1 });
    }

    return res.json({ users, posts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
