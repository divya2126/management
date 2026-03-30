const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String, // e.g., "B.Tech Computer Science"
      required: true,
    },
    code: {
      type: String, // e.g., "BTECH-CSE"
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    totalSemesters: {
      type: Number,
      required: true,
      default: 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
