function formatExecutionError(output, language) {
    if (/timeout/.test(output.toLowerCase())) {
        return "Execution timed out. Possible infinite loop or long-running operation.";
      }

    if (!output || typeof output !== "string") return "Unknown error";
  
    if (language === "python") {
      const match = output.match(/File ".*", line (\d+)[^\n]*\n\s*(.*)\n\s*\^\n(.*)/);
      if (match) {
        const [, line, code, message] = match;
        return `SyntaxError at line ${line}: ${message.trim()}`;
      }
      return output.split("\n").slice(-1)[0]; // fallback
    }
  
    if (language === "javascript") {
      const typeMatch = output.match(/(SyntaxError|ReferenceError|TypeError):\s(.+)/);
      const locMatch = output.match(/at .*:(\d+):(\d+)/);
      if (typeMatch && locMatch) {
        const [, type, msg] = typeMatch;
        const [, line, col] = locMatch;
        return `${type} at line ${line}, col ${col}: ${msg}`;
      } else if (typeMatch) {
        const [, type, msg] = typeMatch;
        return `${type}: ${msg}`;
      }
      return output.split("\n")[0];
    }
  
    return output;
  }
  
  module.exports = { formatExecutionError };
  