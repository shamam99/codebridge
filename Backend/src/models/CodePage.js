const mongoose = require("mongoose");

const CodePageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: "",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("CodePage", CodePageSchema);
