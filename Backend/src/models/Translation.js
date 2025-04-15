const mongoose = require("mongoose");

const TranslationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for translation history."],
    },
    inputCode: {
      type: String,
      required: [true, "Input code is required."],
      minlength: [3, "Input code must be at least 3 characters."],
      maxlength: [10000, "Input code is too long."],
    },
    outputCode: {
      type: String,
      required: [true, "Output code is required."],
      minlength: [1, "Output code cannot be empty."],
      maxlength: [10000, "Output code is too long."],
    },
    fromLang: {
      type: String,
      required: [true, "Source language is required."],
      enum: {
        values: ["python", "javascript", "java", "cpp", "csharp"],
        message: "Unsupported source language.",
      },
    },
    toLang: {
      type: String,
      required: [true, "Target language is required."],
      enum: {
        values: ["python", "javascript", "java", "cpp", "csharp"],
        message: "Unsupported target language.",
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Translation", TranslationSchema);
