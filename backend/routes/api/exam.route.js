const express = require("express");
const router = express.Router();
const examCtrl = require("../../controllers/exam.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// Everyone authenticated can view exams
router.get("/", authMiddleware, examCtrl.getExams);

// Only admin/hod can create, update, delete
router.post("/", authMiddleware, roleMiddleware("admin", "hod"), examCtrl.createExam);
router.put("/:id", authMiddleware, roleMiddleware("admin", "hod"), examCtrl.updateExam);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "hod"), examCtrl.deleteExam);

module.exports = router;
