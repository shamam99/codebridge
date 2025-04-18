// Language Mappings
const mappings = {
    javascript: {
        python: {
            // Print Statements
            "console\\.log": "print",

            // Variable Declarations
            "let ": "",
            "var ": "",
            "const ": "",

            // Loops
            "for \\(": "for ",
            "while \\(": "while ",

            // Conditionals
            "if \\(": "if ",
            "else if \\(": "elif ",
            "else \\{": "else:",

            // Functions
            "function ": "def ",

            // Comments
            "//": "#",

            // End Blocks (replace "}" with indentation)
            "\\}": "",

            // Math Operators
            "\\+=": "+=",
            "\\-=": "-=",
            "\\*=": "*=",
            "\\/=": "/=",

            // Arrays and Dictionaries
            "\\[": "[", // Array/Dictionaries opening bracket
            "\\]": "]", // Array/Dictionaries closing bracket
            "\\{": "{", // Dictionary opening
            "\\}": "}", // Dictionary closing

            // Nested Loops
            "for \\((.*?) in (.*?)\\)": "for \\1 in \\2:",

            // Object Manipulation
            "\\.push\\(": ".append(",
            "\\.length": "len(",

            // Advanced Conditionals
            "&&": "and",
            "\\|\\|": "or",
        },
    },
    python: {
        javascript: {
            // Print Statements
            "print\\(": "console.log(",

            // Loops
            "for ": "for (",
            "while ": "while (",

            // Conditionals
            "if ": "if (",
            "elif ": "else if (",
            "else:": "else {",

            // Functions
            "def ": "function ",

            // Comments
            "#": "//",

            // Indentation to "}" (close blocks)
            ":": "{",

            // Arrays and Dictionaries
            "\\[": "[", // Array/Dictionaries opening bracket
            "\\]": "]", // Array/Dictionaries closing bracket
            "\\{": "{", // Dictionary opening
            "\\}": "}", // Dictionary closing

            // Object Manipulation
            "\\.append\\(": ".push(",
            "len\\(": ".length",

            // Advanced Conditionals
            "and": "&&",
            "or": "||",
        },
    },
};

// @desc Handle Indentation for Python
// @param {string[]} codeLines - Lines of code
// @param {string} fromLang - Source language
// @param {string} toLang - Target language
const handleIndentation = (codeLines, fromLang, toLang) => {
    if (fromLang === "javascript" && toLang === "python") {
        let indentLevel = 0; 
        return codeLines.map((line) => {
            if (line.trim().endsWith("}")) indentLevel--;

            const indentedLine = "    ".repeat(Math.max(indentLevel, 0)) + line.replace(/[{}]/g, "").trim();

            if (line.trim().endsWith("{")) indentLevel++;

            return indentedLine;
        });
    }
    return codeLines;
};

// @desc Translate Code Between Languages
// @param {string} code - Input code to translate
// @param {string} fromLang - Source language
// @param {string} toLang - Target language
// @returns {string} Translated code
const translateCode = (code, fromLang, toLang) => {
    if (!mappings[fromLang] || !mappings[fromLang][toLang]) {
        throw new Error(`Translation from ${fromLang} to ${toLang} is not supported.`);
    }

    const map = mappings[fromLang][toLang];
    const codeLines = code.split("\n");

    let translatedLines = codeLines.map((line) => {
        let translatedLine = line;
        Object.keys(map).forEach((pattern) => {
            const regex = new RegExp(pattern, "g");
            translatedLine = translatedLine.replace(regex, map[pattern]);
        });
        return translatedLine;
    });

    translatedLines = handleIndentation(translatedLines, fromLang, toLang);

    return translatedLines.join("\n");
};

// Export the translation function
module.exports = { translateCode };
