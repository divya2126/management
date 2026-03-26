const express = require("express");
const router =express.Router();

const {getTeachers} = require("../../controllers/teacher.controller");

router.get("/teachers",getTeachers);

module.exports = router;