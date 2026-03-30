const express = require("express");
const router = express.Router();
const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = require("../../controllers/teacher.controller");

router.get("/", getTeachers);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;