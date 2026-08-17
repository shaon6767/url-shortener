const express = require("express");
const router = express.Router();

const Url = require("../models/Url");
const Click = require("../models/Click");
const { auth } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// GET /api/urls/:id/analytics — click stats grouped by day and device (owner only)
router.get(
  "/:id/analytics",
  auth,
  asyncHandler(async (req, res) => {
    const url = await Url.findById(req.params.id);
    if (!url) throw new ApiError(404, "URL not found");
    if (!url.owner || url.owner.toString() !== req.userId) {
      throw new ApiError(403, "You don't own this URL");
    }

    const clicksByDay = await Click.aggregate([
      { $match: { url: url._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const clicksByDevice = await Click.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
    ]);

    res.json({
      totalClicks: url.clickCount,
      clicksByDay,
      clicksByDevice,
    });
  }),
);

module.exports = router;
