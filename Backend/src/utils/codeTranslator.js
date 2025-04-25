const { runCode: runCodeUtil } = require("../utils/codeRunner");

const mappings = {
  javascript: {
    python: [
      // Class definitions
          // Clean up accidental function def prefix
      { pattern: /function\s+def\s+/g, replacement: "def " },

      // Class definitions
      { pattern: /class\s+(\w+)\s*\{/, replacement: "class $1:" },
      { pattern: /constructor\s*\((.*?)\)\s*\{/, replacement: "def __init__(self, $1):" },
      { pattern: /this\.(\w+)/g, replacement: "self.$1" },
      { pattern: /(\w+)\s*\((.*?)\)\s*\{/, replacement: "def $1(self, $2):" }, // method inside class

      // Default parameter (must come before regular function)
      { pattern: /function\s+(\w+)\s*\((\w+)\s*=\s*(.*?)\)\s*\{/, replacement: "def $1($2=$3):" },

      // Function definition
      { pattern: /function\s+(\w+)\s*\((.*?)\)\s*\{/, replacement: "def $1($2):" },

      // If / else if / else blocks
      { pattern: /else if\s*\((.*?)\)\s*\{/, replacement: "elif $1:" },
      { pattern: /if\s*\((.*?)\)\s*\{/, replacement: "if $1:" },
      { pattern: /else\s*\{/, replacement: "else:" },

      // Loops
      { pattern: /for\s*\(\s*(?:let|var|const)?\s*(\w+)\s+in\s+(.*?)\)\s*\{/, replacement: "for $1 in $2:" },
      { pattern: /while\s*\((.*?)\)\s*\{/, replacement: "while $1:" },

      // Print
      { pattern: /console\.log\((.*?)\);?/, replacement: "print($1)" },

      // Return statement
      { pattern: /return\s+(.*);?/, replacement: "return $1" },

      // Ternary operator
      { pattern: /(\w+)\s*=\s*(.*?)\s*\?\s*(.*?)\s*:\s*(.*)/, replacement: "$1 = $3 if $2 else $4" },

      // Variable declarations
      { pattern: /\b(let|const|var)\s+/, replacement: "" },

      // Object/Array
      { pattern: /\.push\((.*?)\)/, replacement: ".append($1)" },
      { pattern: /(\w+)\.length/, replacement: "len($1)" },

      // Logical and comparison operators
      { pattern: /&&/g, replacement: "and" },
      { pattern: /\|\|/g, replacement: "or" },
      { pattern: /===/g, replacement: "==" },

      // Comments
      { pattern: /\/\/(.*)/, replacement: "# $1" },

      // Cleanup
      { pattern: /;/g, replacement: "" },
      { pattern: /\}/g, replacement: "" }
    ]
  },

  python: {
    javascript: [
      // Class definitions
      { pattern: /class\s+(\w+):/, replacement: "class $1 {" },
      { pattern: /def __init__\(self, (.*?)\):/, replacement: "constructor($1) {" },
      { pattern: /self\.(\w+)/g, replacement: "this.$1" },
      { pattern: /def\s+(\w+)\(self(?:, )?(.*?)?\):/, replacement: "$1($2) {" },

      // Default parameter
      { pattern: /def\s+(\w+)\s*\((\w+)\s*=\s*(.*?)\):/, replacement: "function $1($2=$3) {" },

      // Function definition
      { pattern: /def\s+(\w+)\((.*?)\):/, replacement: "function $1($2) {" },

      // If / elif / else
      { pattern: /elif\s+(.*):/, replacement: "else if ($1) {" },
      { pattern: /if\s+(.*):/, replacement: "if ($1) {" },
      { pattern: /else:/, replacement: "else {" },

      // Loops
      { pattern: /for\s+(\w+)\s+in\s+(.*):/, replacement: "for (let $1 in $2) {" },
      { pattern: /while\s+(.*):/, replacement: "while ($1) {" },

      // Print
      { pattern: /print\((.*?)\)/, replacement: "console.log($1);" },

      // Return
      { pattern: /return\s+(.*)/, replacement: "return $1;" },

      // Ternary
      { pattern: /(\w+)\s*=\s*(.*?)\s+if\s+(.*?)\s+else\s+(.*)/, replacement: "$1 = $3 ? $2 : $4" },

      // Arrays
      { pattern: /\.append\((.*?)\)/, replacement: ".push($1)" },
      { pattern: /len\((.*?)\)/, replacement: "$1.length" },

      // Logic
      { pattern: /\band\b/g, replacement: "&&" },
      { pattern: /\bor\b/g, replacement: "||" },

      // Comments
      { pattern: /#(.*)/, replacement: "//$1" },

      // Indentation cleanup
      { pattern: /^\s+/gm, replacement: "" }
    ]
  }
};

const handleIndentation = (lines, fromLang, toLang) => {
  if (fromLang === "javascript" && toLang === "python") {
    let indentLevel = 0;
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
        return "";
      }
      const indented = "    ".repeat(indentLevel) + trimmed;
      if (trimmed.endsWith(":")) indentLevel++;
      return indented;
    });
  }

  if (fromLang === "python" && toLang === "javascript") {
    return lines.map(line => line.trim());
  }

  return lines;
};

const fixPythonSyntax = (lines) => {
  return lines.map(line =>
    line.replace(/def\s+(\w+)\(self,\s*\):/, "def $1(self):")
  );
};

const translateCode = (code, fromLang, toLang) => {
  if (!mappings[fromLang] || !mappings[fromLang][toLang]) {
    throw new Error(`Translation from ${fromLang} to ${toLang} is not supported.`);
  }

  const rules = mappings[fromLang][toLang];
  const lines = code.split("\n");

  let translated = lines.map(line => {
    let output = line;
    rules.forEach(({ pattern, replacement }) => {
      output = output.replace(pattern, replacement);
    });
    return output;
  });

  // ✅ Handle empty Python functions
  if (fromLang === "javascript" && toLang === "python") {
    for (let i = 0; i < translated.length; i++) {
      const line = translated[i].trim();
      if (/^def\s+\w+\(.*\):$/.test(line)) {
        const nextLine = translated[i + 1] ? translated[i + 1].trim() : "";
        if (
          !nextLine ||
          (!nextLine.startsWith("print") &&
            !nextLine.startsWith("#") &&
            !nextLine.startsWith("return") &&
            !nextLine.startsWith("self"))
        ) {
          translated.splice(i + 1, 0, "    pass");
        }
      }
    }
  }

  const indented = handleIndentation(translated, fromLang, toLang);
  const final = (fromLang === "javascript" && toLang === "python")
    ? fixPythonSyntax(indented)
    : indented;

  return final.join("\n");
};

const runCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    const output = await runCodeUtil(code, language);
    res.status(200).json({ message: "Execution success", output });
  } catch (error) {
    res.status(500).json({ message: "Execution failed", output: error.toString() });
  }
};

module.exports = { translateCode, runCode };
