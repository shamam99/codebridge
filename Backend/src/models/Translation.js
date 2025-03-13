const mongoose = require("mongoose");

const TranslationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inputCode: { type: String, required: true },
    outputCode: { type: String, required: true },
    fromLang: { type: String, required: true },
    toLang: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

TranslationSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
module.exports = mongoose.model("Translation", TranslationSchema);
