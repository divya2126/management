const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/management", require("./management.route"));
router.use("/teachers", require("./teacher.route"));
router.use("/students", require("./student.route"));
router.use("/notifications", require("./notification.route"));
router.use("/timetable", require("./timetable.route"));
router.use("/dashboard", require("./dashboard.route"));

module.exports = router;