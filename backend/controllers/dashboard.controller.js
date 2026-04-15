const RegisterModel = require('../model/Register.model');
const Teacher       = require('../model/Teacher.model');
const Subject       = require('../model/Subject.model');
const Room          = require('../model/Room.model');
const Timetable     = require('../model/Timetable.model');
const Notification  = require('../model/Notification.model');
const Student       = require('../model/Student.model');

exports.getDashboardMetrics = async (req, res) => {
  try {
    // Run all count queries in parallel for speed
    const [
      totalStudents,
      activeTeachers,
      teachersOnLeave,
      totalSubjects,
      totalRooms,
      recentActivity,
      teachersForWorkload,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments({ status: "Active" }),
      Teacher.countDocuments({ status: "On Leave" }),
      Subject.countDocuments(),
      Room.countDocuments(),
      Notification.find()
        .populate("senderId", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Teacher.find({ status: "Active" }).limit(6).lean(),
    ]);

    // ✅ Real teacher workload from timetable — no fake Math.random()
    const teacherWorkload = await Promise.all(
      teachersForWorkload.map(async (t) => {
        const assigned = await Timetable.countDocuments({ teacherId: t._id });
        return {
          name: t.name.split(" ").pop(), // Last name for compact display
          assigned,
          max: 18, // Industry standard max weekly slots
        };
      })
    );

    res.json({
      success: true,
      metrics: {
        totalStudents,
        activeTeachers,
        teachersOnLeave,
        totalSubjects,
        totalRooms,
      },
      activity: recentActivity.map((n) => ({
        id:      n._id,
        message: n.message,
        type:    n.type,
        date:    n.createdAt || n.date,
        sender:  n.senderId?.name || "System",
      })),
      workload: teacherWorkload,
    });
  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
