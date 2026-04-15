const express = require("express");
const router = express.Router();
const { getStudents, createStudent, updateStudent, deleteStudent } = require("../../controllers/student.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.get("/", authMiddleware, getStudents);
router.post("/", authMiddleware, roleMiddleware("admin", "hod"), createStudent);
router.put("/:id", authMiddleware, roleMiddleware("admin", "hod"), updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "hod"), deleteStudent);

module.exports = router;
