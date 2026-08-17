const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Owner's URL list is fetched sorted newest-first — compound index covers both.
urlSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Url", urlSchema);
