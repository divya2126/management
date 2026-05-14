const express = require("express");
const router = express.Router();
const timetableController = require("../../controllers/timetable.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const generatorController = require("../../controllers/timetable-generator.controller");

// Everyone can view the timetable (controller filters by role)
router.get("/", authMiddleware, timetableController.getTimetable);

// ✅ Get teachers available for a specific day+slot (must come before /:id to avoid route conflict)
router.get("/available-teachers", authMiddleware, roleMiddleware("admin", "hod"), timetableController.getAvailableTeachers);

// Only Admin and HOD can create, edit, delete, generate
router.post("/generate", authMiddleware, roleMiddleware("admin", "hod"), generatorController.generateTimetable);

router.post("/", authMiddleware, roleMiddleware("admin", "hod"), timetableController.createTimetable);
router.put("/:id", authMiddleware, roleMiddleware("admin", "hod"), timetableController.updateTimetable);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "hod"), timetableController.deleteTimetable);

module.exports = router;
