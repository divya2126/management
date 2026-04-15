const router = require("express").Router();
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const departmentCtrl = require("../../controllers/department.controller");
const courseCtrl = require("../../controllers/course.controller");
const subjectCtrl = require("../../controllers/subject.controller");
const roomCtrl = require("../../controllers/room.controller");

// Require Auth for all academic structure routes
router.use(authMiddleware);

const adminOnly = roleMiddleware("admin");
const adminAndHod = roleMiddleware("admin", "hod");

// Departments
router.post("/departments", adminOnly, departmentCtrl.createDepartment);
router.get("/departments", adminAndHod, departmentCtrl.getDepartments);
router.put("/departments/:id", adminOnly, departmentCtrl.updateDepartment);
router.delete("/departments/:id", adminOnly, departmentCtrl.deleteDepartment);

// Courses
router.post("/courses", adminAndHod, courseCtrl.createCourse);
router.get("/courses", courseCtrl.getCourses);
router.put("/courses/:id", adminAndHod, courseCtrl.updateCourse);
router.delete("/courses/:id", adminAndHod, courseCtrl.deleteCourse);

// Subjects
router.post("/subjects", adminAndHod, subjectCtrl.createSubject);
router.get("/subjects", subjectCtrl.getSubjects);
router.put("/subjects/:id", adminAndHod, subjectCtrl.updateSubject);
router.delete("/subjects/:id", adminAndHod, subjectCtrl.deleteSubject);

// Rooms
router.post("/rooms", adminAndHod, roomCtrl.createRoom);
router.get("/rooms", roomCtrl.getRooms);
router.put("/rooms/:id", adminAndHod, roomCtrl.updateRoom);
router.delete("/rooms/:id", adminAndHod, roomCtrl.deleteRoom);

module.exports = router;
