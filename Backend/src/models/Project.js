const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPinned: { type: Boolean, default: false },
    visibility: { type: String, enum: ["public", "private"], default: "private" }, 
}, {
    timestamps: true,
});


module.exports = mongoose.model("Project", ProjectSchema);
