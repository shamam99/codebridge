const CodePage = require("../models/CodePage");

// @desc Create a new code page
// @route POST /api/code/pages
const createCodePage = async (req, res) => {
    const { title, language, content } = req.body;

    try {
        const codePage = await CodePage.create({
            title,
            language,
            content,
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Code page created successfully", codePage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Fetch all code pages for a user
// @route GET /api/code/pages
const getCodePages = async (req, res) => {
    try {
        const codePages = await CodePage.find({ createdBy: req.user._id });
        res.status(200).json(codePages);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Delete a code page
// @route DELETE /api/code/pages/:id
const deleteCodePage = async (req, res) => {
    try {
        const codePage = await CodePage.findById(req.params.id);

        if (!codePage) {
            return res.status(404).json({ message: "Code page not found" });
        }

        if (codePage.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await codePage.remove();
        res.status(200).json({ message: "Code page deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createCodePage, getCodePages, deleteCodePage };
