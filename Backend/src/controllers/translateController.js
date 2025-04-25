const { translateCode } = require("../utils/codeTranslator");
const Translation = require("../models/Translation");
const { runCode, debugCode: debugCodeUtil  } = require("../utils/codeRunner");

// @desc Translate Code
// @route POST /api/translate
const translateCodeHandler = async (req, res) => {
    const { code, fromLang, toLang } = req.body;

    try {
        const translatedCode = translateCode(code, fromLang, toLang);

        if (req.user) {
            await Translation.create({
                userId: req.user._id,
                inputCode: code,
                outputCode: translatedCode,
                fromLang,
                toLang,
            });
        }

        res.json({
            message: "Translation successful",
            translatedCode,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Fetch Translation History
// @route GET /api/translate/history
const getTranslationHistory = async (req, res) => {
    try {
        const history = await Translation.find({ userId: req.user._id });
        res.json(history); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc Get list of available programming languages
// @route GET /api/translate/languages
const getLanguages = (req, res) => {
    const languages = [
        { name: "Python", code: "python" },
        { name: "JavaScript", code: "javascript" },
        { name: "Java", code: "java" },
        { name: "C++", code: "cpp" },
        { name: "C#", code: "csharp" },
    ];

    res.status(200).json(languages);
};


// @desc Run code
// @route POST /api/code/run
const runCodeHandler = async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }
  
    try {
      const result = await runCode(code, language);
      const status = result.success ? 200 : 400;
  
      res.status(status).json({
        message: result.success ? "Execution success" : "Execution failed",
        output: result.output,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", output: error.message });
    }
  };

// @desc Debug code
// @route POST /api/code/debug
const debugCodeHandler = async (req, res) => {
    const { code, language } = req.body;
  
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }
  
    try {
      const result = await debugCodeUtil(code, language);
      const status = result.success ? 200 : 400;
  
      res.status(status).json({
        message: result.success ? "Debugging success" : "Debugging failed",
        debugOutput: result.output,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", debugOutput: error.message });
    }
  };

module.exports = { translateCodeHandler, getTranslationHistory, getLanguages, runCodeHandler, debugCodeHandler };


