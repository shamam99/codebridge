const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { formatExecutionError } = require("./errorFormatter");


const runCode = (code, language) => {
  return new Promise((resolve) => {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileId = uuidv4();
    const extension = language === "python" ? "py" : "js";
    const filePath = path.join(tempDir, `${fileId}.${extension}`);
    const command = language === "python" ? `python3 ${filePath}` : `node ${filePath}`;

    fs.writeFileSync(filePath, code);

    exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(filePath); // cleanup

      if (err) {
        const formatted = formatExecutionError(stderr || err.message, language);
        return resolve({ success: false, output: formatted });
      }

      resolve({ success: true, output: stdout });
    });
  });
};

const debugCode = (code, language) => {
    return new Promise((resolve) => {
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
      const fileId = uuidv4();
      const extension = language === "python" ? "py" : "js";
      const filePath = path.join(tempDir, `${fileId}.${extension}`);
      let command;
  
      if (language === "python") {
        fs.writeFileSync(filePath, code);
        command = `python3 -m trace --trace ${filePath}`;
      } else if (language === "javascript") {
        // Inject logging line-by-line
        const loggedCode = code
          .split("\n")
          .map((line, idx) =>
            `console.log(\`Line ${idx + 1}: ${line.replace(/`/g, "\\`")}\`);\n${line}`
          )
          .join("\n");
  
        fs.writeFileSync(filePath, loggedCode);
        command = `node ${filePath}`;
      } else {
        return resolve({ success: false, output: "Unsupported language." });
      }
  
      exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
        fs.unlinkSync(filePath); // cleanup temp file
  
        if (err) {
          return resolve({
            success: false,
            output: stderr || err.message || "Execution failed",
          });
        }
  
        // Clean Python trace output
        if (language === "python") {
          const filtered = stdout
            .split("\n")
            .filter((line) =>
              line.trim().startsWith("---") || line.match(/\.py\(\d+\)/)
            )
            .map((line) => {
              if (line.includes(".py(")) {
                const match = line.match(/\.py\((\d+)\):\s*(.*)/);
                if (match) return `Line ${match[1]}: ${match[2]}`;
              }
              return line;
            })
            .join("\n");
  
          return resolve({
            success: true,
            output: filtered || "Trace completed but no relevant output captured.",
          });
        }
  
        // JavaScript logs already present in output
        return resolve({
          success: true,
          output: stdout || "Execution finished with no output.",
        });
      });
    });
  };
  

module.exports = { 
    runCode,
    debugCode
 };
