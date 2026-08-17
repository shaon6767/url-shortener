const rateLimit = require("express-rate-limit");

// Prevents spam-shortening abuse — 10 new links per IP per minute.
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many URLs created, please try again in a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = shortenLimiter;
