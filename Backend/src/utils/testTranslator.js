const { translateCode } = require("./codeTranslator");

// Example Input
const jsCode = `
function greet(name) {
    console.log("Hello, " + name + "!");
}

for (let i = 0; i < 5; i++) {
    console.log(i);
}
`;

// Translate from JavaScript to Python
try {
    const pythonCode = translateCode(jsCode, "javascript", "python");
    console.log("Translated Code (Python):\n", pythonCode);
} catch (error) {
    console.error(error.message);
}
