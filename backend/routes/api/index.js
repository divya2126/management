const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/management", require("./management.route"));
router.use("/teachers", require("./teacher.route"));
router.use("/students", require("./student.route"));

module.exports = router;