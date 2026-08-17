const express = require("express");
const router = express.Router();

const Url = require("../models/Url");
const Click = require("../models/Click");
const redisClient = require("../config/redisClient");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// GET /:code — resolves a short code and redirects to the original URL.
// Checks Redis first so the hot path never has to hit MongoDB.
router.get(
  "/:code",
  asyncHandler(async (req, res) => {
    const { code } = req.params;

    let originalUrl = await redisClient.get(`url:${code}`);

    if (!originalUrl) {
      const url = await Url.findOne({ shortCode: code });
      if (!url) throw new ApiError(404, "Short URL not found");
      originalUrl = url.originalUrl;
      await redisClient.set(`url:${code}`, originalUrl, "EX", 60 * 60 * 24);
    }

    // Log the click and bump the counter without blocking the redirect.
    Url.findOneAndUpdate({ shortCode: code }, { $inc: { clickCount: 1 } })
      .then((url) => {
        if (url) {
          const device = /mobile/i.test(req.headers["user-agent"] || "")
            ? "mobile"
            : "desktop";
          return Click.create({
            url: url._id,
            device,
            referrer: req.headers.referer || "direct",
          });
        }
      })
      .catch((err) => console.error("Click logging failed:", err));

    res.redirect(originalUrl);
  }),
);

module.exports = router;
