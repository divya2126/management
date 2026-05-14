const TeacherProfile = require("../model/TeacherProfile.model");
const RegisterModel = require("../model/Register.model");
const Teacher = require("../model/Teacher.model");

// GET /api/teacher-profiles/:teacherId (teacherId is from the Teacher collection)
exports.getProfileByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // 1. Find the teacher in the Teacher collection to get their email
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // 2. Find their corresponding login account in RegisterModel
    const userAccount = await RegisterModel.findOne({ email: teacher.email });
    if (!userAccount) {
      return res.status(404).json({ success: false, message: "Teacher login account not found" });
    }

    // 3. Find the TeacherProfile
    let profile = await TeacherProfile.findOne({ user: userAccount._id })
      .populate("department", "name")
      .populate("subjectsCanTeach", "name code");

    // If no profile exists, return a default empty structure
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          user: userAccount._id,
          department: null,
          subjectsCanTeach: [],
          maxLecturesPerWeek: 20,
          unavailableDays: [],
        },
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Get Teacher Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/teacher-profiles/upsert
exports.upsertProfile = async (req, res) => {
  try {
    const { teacherId, department, subjectsCanTeach, maxLecturesPerWeek, unavailableDays } = req.body;

    // 1. Get the user account
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });

    const userAccount = await RegisterModel.findOne({ email: teacher.email });
    if (!userAccount) return res.status(404).json({ success: false, message: "Teacher login account not found" });

    // 2. Upsert the profile
    const profile = await TeacherProfile.findOneAndUpdate(
      { user: userAccount._id },
      {
        user: userAccount._id,
        department,
        subjectsCanTeach: subjectsCanTeach || [],
        maxLecturesPerWeek: maxLecturesPerWeek || 20,
        unavailableDays: unavailableDays || [],
      },
      { new: true, upsert: true } // upsert: create if doesn't exist
    );

    res.status(200).json({ success: true, message: "Academic Profile updated successfully", data: profile });
  } catch (error) {
    console.error("Upsert Teacher Profile Error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};
