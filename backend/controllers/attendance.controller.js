const Attendance = require("../model/Attendance.model");
const Timetable  = require("../model/Timetable.model");
const Teacher    = require("../model/Teacher.model");
const Student    = require("../model/Student.model");
const RegisterModel = require("../model/Register.model");

// ─── GET /api/attendance ──────────────────────────────────────────────────────
exports.getAttendance = async (req, res) => {
  try {
    const { courseId, subjectId, date } = req.query;

    if (!courseId || !subjectId || !date) {
      return res.status(400).json({ success: false, message: "courseId, subjectId, and date are required" });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    const attendance = await Attendance.findOne({
      courseId,
      subjectId,
      date: { $gte: searchDate, $lt: nextDate },
    }).populate("records.studentId", "name email");

    if (!attendance) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
};

// ─── GET /api/attendance/my — Student: fetch own attendance summary ───────────
exports.getMyAttendance = async (req, res) => {
  try {
    // Resolve student profile from auth token
    const regUser = await RegisterModel.findById(req.user.id).select("email").lean();
    if (!regUser) return res.status(404).json({ success: false, message: "User not found" });

    const studentProfile = await Student.findOne({ email: regUser.email }).select("_id name").lean();
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: "Student profile not found. Ask admin to register you." });
    }

    // Find all attendance records that include this student
    const records = await Attendance.find({
      "records.studentId": studentProfile._id,
    })
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .lean();

    // Summarise: total classes attended vs total classes
    let totalClasses = 0;
    let present = 0;

    const perSubject = {};

    records.forEach((att) => {
      const subjectName = att.subjectId?.name || "Unknown";
      const myRecord = att.records.find(
        (r) => r.studentId?.toString() === studentProfile._id.toString()
      );
      if (!myRecord) return;

      totalClasses++;
      if (myRecord.status === "Present") present++;

      if (!perSubject[subjectName]) perSubject[subjectName] = { present: 0, total: 0 };
      perSubject[subjectName].total++;
      if (myRecord.status === "Present") perSubject[subjectName].present++;
    });

    const overallPercentage = totalClasses > 0
      ? Math.round((present / totalClasses) * 100)
      : null;

    res.status(200).json({
      success: true,
      data: {
        studentName: studentProfile.name,
        totalClasses,
        present,
        absent: totalClasses - present,
        overallPercentage,
        perSubject: Object.entries(perSubject).map(([subject, stats]) => ({
          subject,
          present: stats.present,
          total: stats.total,
          percentage: Math.round((stats.present / stats.total) * 100),
        })),
      },
    });
  } catch (error) {
    console.error("Get My Attendance Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
};

// ─── POST /api/attendance ─────────────────────────────────────────────────────
exports.markAttendance = async (req, res) => {
  try {
    const { courseId, subjectId, date, records } = req.body;

    if (!courseId || !subjectId || !date || !records) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const teacherId = req.user.id;

    // ✅ Ownership check: verify this teacher is actually assigned to this course/subject
    // Resolve the RegisterModel ID → Teacher profile
    const regUser = await RegisterModel.findById(teacherId).select("email role").lean();

    if (regUser?.role === "teacher") {
      const teacherProfile = await Teacher.findOne({ email: regUser.email }).select("_id").lean();
      if (teacherProfile) {
        const isAssigned = await Timetable.exists({
          teacherId: teacherProfile._id,
          courseId,
          subjectId,
        });
        if (!isAssigned) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: You are not assigned to teach this course/subject.",
          });
        }
      }
    }
    // Admins and HODs can mark for any class — no ownership check needed

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    let attendance = await Attendance.findOne({
      courseId,
      subjectId,
      date: { $gte: searchDate, $lt: nextDate },
    });

    if (attendance) {
      attendance.records  = records;
      attendance.teacherId = teacherId;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        courseId,
        subjectId,
        teacherId,
        date: searchDate,
        records,
      });
    }

    res.status(200).json({ success: true, message: "Attendance saved successfully", data: attendance });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ success: false, message: "Failed to save attendance" });
  }
};
