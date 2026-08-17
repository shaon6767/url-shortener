const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    url: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
    device: { type: String, default: "unknown" },
    referrer: { type: String, default: "direct" },
  },
  { timestamps: true },
);

// Analytics aggregation groups clicks by url and by day — this index supports it.
clickSchema.index({ url: 1, createdAt: -1 });

module.exports = mongoose.model("Click", clickSchema);
