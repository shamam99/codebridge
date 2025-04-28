const News = require("../models/News");

// @desc Fetch All News Articles (with pagination)
// @route GET /api/news
// @access Public
const getNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const news = await News.find()
            .populate("postedBy", "name email")
            .sort({ timestamp: -1 })
            .limit(limit);

        const total = await News.countDocuments();

        res.json({ news, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: "Error fetching news", error: error.message });
    }
};

// @desc Fetch News Article by ID
// @route GET /api/news/:id
// @access Public
const getNewsById = async (req, res) => {
    try {
        const article = await News.findById(req.params.id).populate("postedBy", "name email");
        if (!article) return res.status(404).json({ message: "News article not found" });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news article", error: error.message });
    }
};

// @desc Add a New News Article
// @route POST /api/news
// @access Admin
const createNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const article = await News.create({
            title,
            content,
            postedBy: req.user._id,
        });
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: "Error creating news article", error: error.message });
    }
};

// @desc Update News Article
// @route PUT /api/news/:id
// @access Admin
const updateNews = async (req, res) => {
    try {
        const { title, content } = req.body;

        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "News article not found" });

        article.title = title || article.title;
        article.content = content || article.content;
        await article.save();

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: "Error updating news article", error: error.message });
    }
};

// @desc Delete News Article
// @route DELETE /api/news/:id
// @access Admin
const deleteNews = async (req, res) => {
    try {
        const article = await News.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: "News article not found" });
        res.json({ message: "News article deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting news article", error: error.message });
    }
};

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
