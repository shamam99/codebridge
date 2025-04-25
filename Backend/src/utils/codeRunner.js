const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runCode = (code, language) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileId = uuidv4();
    const extension = language === "python" ? "py" : "js";
    const filePath = path.join(tempDir, `${fileId}.${extension}`);
    const command = language === "python" ? `python3 ${filePath}` : `node ${filePath}`;

    fs.writeFileSync(filePath, code);

    exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(filePath); // cleanup temp file

      if (err) {
        return reject(stderr || err.message);
      }

      resolve(stdout);
    });
  });
};

module.exports = { runCode };
