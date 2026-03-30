const router = require("express").Router();
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const departmentCtrl = require("../../controllers/department.controller");
const courseCtrl = require("../../controllers/course.controller");
const subjectCtrl = require("../../controllers/subject.controller");
const roomCtrl = require("../../controllers/room.controller");

// Require Admin rights for academic structure routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// Departments
router.post("/departments", departmentCtrl.createDepartment);
router.get("/departments", departmentCtrl.getDepartments);
router.delete("/departments/:id", departmentCtrl.deleteDepartment);

// Courses
router.post("/courses", courseCtrl.createCourse);
router.get("/courses", courseCtrl.getCourses);
router.delete("/courses/:id", courseCtrl.deleteCourse);

// Subjects
router.post("/subjects", subjectCtrl.createSubject);
router.get("/subjects", subjectCtrl.getSubjects);
router.delete("/subjects/:id", subjectCtrl.deleteSubject);

// Rooms
router.post("/rooms", roomCtrl.createRoom);
router.get("/rooms", roomCtrl.getRooms);
router.delete("/rooms/:id", roomCtrl.deleteRoom);

module.exports = router;
