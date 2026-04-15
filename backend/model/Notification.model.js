const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisterModel",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["leave", "general", "urgent"],
      default: "general",
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "teacher"],
      default: "all",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Fast inbox queries: filter by role, sorted newest-first
notificationSchema.index({ targetRole: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);

