const express = require("express");
const router = express.Router();
const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = require("../../controllers/teacher.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// ✅ Only admin/hod can list ALL teachers. Teachers can see the list too (needed for timetable UI).
// Students are NOT allowed.
router.get("/", authMiddleware, roleMiddleware("admin", "hod", "teacher"), getTeachers);
router.post("/", authMiddleware, roleMiddleware("admin", "hod"), createTeacher);
router.put("/:id", authMiddleware, roleMiddleware("admin", "hod"), updateTeacher);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "hod"), deleteTeacher);

module.exports = router;