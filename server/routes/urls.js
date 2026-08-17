const express = require("express");
const router = express.Router();

const Url = require("../models/Url");
const redisClient = require("../config/redisClient");
const { auth, optionalAuth } = require("../middleware/auth");
const shortenLimiter = require("../middleware/rateLimiter");
const generateCode = require("../utils/generateCode");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 1 day

// POST /api/urls — shorten a URL (works for guests and logged-in users)
router.post(
  "/",
  shortenLimiter,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) throw new ApiError(400, "originalUrl is required");

    let shortCode = generateCode();
    // Extremely unlikely, but guard against a collision anyway.
    while (await Url.findOne({ shortCode })) {
      shortCode = generateCode();
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      owner: req.userId || null,
    });

    await redisClient.set(
      `url:${shortCode}`,
      originalUrl,
      "EX",
      CACHE_TTL_SECONDS,
    );

    res.status(201).json(url);
  }),
);

// GET /api/urls/mine — logged-in user's shortened URLs
router.get(
  "/mine",
  auth,
  asyncHandler(async (req, res) => {
    const urls = await Url.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(urls);
  }),
);

// GET /api/urls/:id — single URL detail (owner only)
router.get(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const url = await Url.findById(req.params.id);
    if (!url) throw new ApiError(404, "URL not found");
    if (!url.owner || url.owner.toString() !== req.userId) {
      throw new ApiError(403, "You don't own this URL");
    }
    res.json(url);
  }),
);

module.exports = router;
