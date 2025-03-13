const Post = require("../models/Post");

// @desc Fetch All Posts
// @route GET /api/community
// @access Private
const getPosts = async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
};

// @desc Fetch Post by ID
// @route GET /api/community/:id
// @access Private
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error: error.message });
    }
};

// @desc Create a New Post
// @route POST /api/community
// @access Private
const createPost = async (req, res) => {
    const { title, content } = req.body;
    const post = await Post.create({ userId: req.user._id, title, content });
    res.status(201).json(post);
};

// @desc Update a Post
// @route PUT /api/community/:id
// @access Private
const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error: error.message });
    }
};

// @desc Delete a Post
// @route DELETE /api/community/:id
// @access Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
