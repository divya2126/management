const Attendance = require("../model/Attendance.model");
const Timetable  = require("../model/Timetable.model");
const Teacher    = require("../model/Teacher.model");
const Student    = require("../model/Student.model");
const RegisterModel = require("../model/Register.model");
const crypto = require("crypto");
const dayjs = require("dayjs");

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

// ─── GET /api/attendance/today (For Teachers) ─────────────────────────────────
exports.getScheduledClassesToday = async (req, res) => {
  try {
    const regUser = await RegisterModel.findById(req.user.id).select("email").lean();
    if (!regUser) return res.status(404).json({ success: false, message: "User not found" });

    const teacher = await Teacher.findOne({ email: regUser.email }).select("_id").lean();
    if (!teacher && req.user.role !== 'admin' && req.user.role !== 'hod') {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const todayDayName = dayjs().format("dddd"); // e.g. "Monday"
    
    let query = { dayOfWeek: todayDayName };
    if (teacher) query.teacherId = teacher._id;

    const schedules = await Timetable.find(query)
      .populate("courseId", "name code")
      .populate("subjectId", "name code")
      .populate("roomId", "roomNumber")
      .sort({ slot: 1 })
      .lean();

    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    console.error("Get Scheduled Classes Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── POST /api/attendance/session/start ───────────────────────────────────────
exports.startSession = async (req, res) => {
  try {
    const { courseId, subjectId } = req.body;
    if (!courseId || !subjectId) return res.status(400).json({ success: false, message: "courseId and subjectId are required" });

    const regUser = await RegisterModel.findById(req.user.id).select("email").lean();
    const teacher = await Teacher.findOne({ email: regUser?.email }).select("_id").lean();
    const teacherIdToSave = teacher ? teacher._id : req.user.id;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // Generate 6-digit alphanumeric token
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    let attendance = await Attendance.findOne({
      courseId,
      subjectId,
      date: todayDate,
    });

    if (!attendance) {
      // Find all students for this course to initialize records
      const allStudentsInCourse = await Student.find({ status: "Active" }); // Ideally filter by department/course if available in Student model
      const records = allStudentsInCourse.map(s => ({ studentId: s._id, status: "Absent" }));

      attendance = new Attendance({
        courseId,
        subjectId,
        teacherId: teacherIdToSave,
        date: todayDate,
        records,
      });
    }

    attendance.activeToken = token;
    attendance.tokenExpiresAt = expiresAt;
    await attendance.save();

    res.status(200).json({ success: true, token, expiresAt });
  } catch (error) {
    console.error("Start Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── GET /api/attendance/session/active ───────────────────────────────────────
exports.getActiveSession = async (req, res) => {
  try {
    const { courseId, subjectId } = req.query;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      courseId, subjectId, date: todayDate
    }).populate("records.studentId", "name email");

    if (!attendance || !attendance.activeToken || attendance.tokenExpiresAt < new Date()) {
      return res.status(200).json({ success: true, active: false, data: attendance });
    }

    res.status(200).json({ 
      success: true, 
      active: true, 
      token: attendance.activeToken, 
      expiresAt: attendance.tokenExpiresAt,
      data: attendance 
    });
  } catch (error) {
    console.error("Get Active Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── POST /api/attendance/session/verify ──────────────────────────────────────
exports.verifySession = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token is required" });

    const attendance = await Attendance.findOne({ activeToken: token.toUpperCase() });
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Invalid or expired code" });
    }

    if (attendance.tokenExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "This attendance session has expired" });
    }

    // Identify student
    const regUser = await RegisterModel.findById(req.user.id).select("email").lean();
    if (!regUser) return res.status(404).json({ success: false, message: "User not found" });

    const studentProfile = await Student.findOne({ email: regUser.email }).select("_id").lean();
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    // Find student in records
    const recordIndex = attendance.records.findIndex(r => r.studentId.toString() === studentProfile._id.toString());
    
    if (recordIndex > -1) {
      if (attendance.records[recordIndex].status === "Present") {
         return res.status(200).json({ success: true, message: "You have already marked your attendance" });
      }
      attendance.records[recordIndex].status = "Present";
    } else {
      // If student was not in the initial records list, add them (edge case)
      attendance.records.push({ studentId: studentProfile._id, status: "Present" });
    }

    await attendance.save();

    res.status(200).json({ success: true, message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Verify Session Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
