const router = require("express").Router();
const teacherRoutes = require("./teacher.route");
router.use("/auth", require("./auth.route"));
router.use("/teachers", teacherRoutes);

module.exports = router;