const express = require("express");
const router = express.Router();
const attendanceCtrl = require("../../controllers/attendance.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// GET /api/attendance/my — Students fetch their own attendance summary
// ✅ Must be declared before /:id routes to avoid Express matching "my" as an ID
router.get("/my", authMiddleware, roleMiddleware("student"), attendanceCtrl.getMyAttendance);

// GET /api/attendance — Teachers/HOD/Admin view attendance for a class
router.get("/", authMiddleware, roleMiddleware("admin", "hod", "teacher"), attendanceCtrl.getAttendance);

// POST /api/attendance — Mark attendance (ownership check is inside controller)
router.post("/", authMiddleware, roleMiddleware("admin", "hod", "teacher"), attendanceCtrl.markAttendance);

module.exports = router;
