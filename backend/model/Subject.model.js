const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["theory", "lab"],
      default: "theory",
    },
    credits: {
      type: Number,
      default: 3,
    },
    weeklyLectures: {
      type: Number, // Auto-generation engine uses this to know how many slots to allocate per week
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
