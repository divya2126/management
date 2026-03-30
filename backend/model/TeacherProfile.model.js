const mongoose = require("mongoose");

const TeacherProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register", // Links to the main user account (RegisterModel)
      required: true,
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    // The core subjects this teacher is qualified to teach
    subjectsCanTeach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    // Helps algorithm balance workloads
    maxLecturesPerWeek: {
      type: Number,
      default: 20,
    },
    // The engine must AVOID scheduling them on these days
    unavailableDays: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherProfile", TeacherProfileSchema);
