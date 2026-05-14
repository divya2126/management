const router = require("express").Router();

const authRoutes = require("./auth.route");
const managementRoutes = require("./management.route");
const studentRoutes = require("./student.route");
const teacherRoutes = require("./teacher.route");
const notificationRoutes = require("./notification.route");
const timetableRoutes = require("./timetable.route");
const attendanceRoutes = require("./attendance.route");
const leaveRoutes = require("./leave.route");
const dashboardRoutes = require("./dashboard.route");

router.use("/auth", require("./auth.route"));
router.use("/management", require("./management.route"));
router.use("/teachers", require("./teacher.route"));
router.use("/students", require("./student.route"));
router.use("/notifications", require("./notification.route"));
router.use("/timetable", require("./timetable.route"));
router.use("/dashboard", require("./dashboard.route"));
router.use("/attendance", require("./attendance.route"));
router.use("/leave", require("./leave.route"));
router.use("/exams", require("./exam.route"));
router.use("/ai", require("./ai.route"));
router.use("/results", require("./result.route"));
router.use("/teacher-profiles", require("./teacherProfile.route"));

module.exports = router;