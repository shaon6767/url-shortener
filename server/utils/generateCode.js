const crypto = require("crypto");

// Generates a short, URL-safe code (e.g. "aZ3dQ1") without needing an
// external ID-generation dependency.
const generateCode = (length = 6) => {
  return crypto.randomBytes(8).toString("base64url").slice(0, length);
};

module.exports = generateCode;
