const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// ✅ Fast queries for a teacher's leave history
leaveRequestSchema.index({ teacherId: 1, createdAt: -1 });
// Status filter for admin approval queue
leaveRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);

