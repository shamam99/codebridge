const bcrypt = require('bcrypt');

// Example number you want to hash
const numberToHash = "1234567s"; // You can change this to any number

// Hashing function
async function hashInput(input) {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(input.toString(), saltRounds);
    console.log("Hashed output:", hashed);
  } catch (error) {
    console.error("Error hashing input:", error);
  }
}

// Run the hashing
hashInput(numberToHash);
