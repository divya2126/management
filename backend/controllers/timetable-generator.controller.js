const mongoose = require("mongoose");
const Timetable = require("../model/Timetable.model");
const Subject = require("../model/Subject.model");
const TeacherProfile = require("../model/TeacherProfile.model");
const Room = require("../model/Room.model");
const Course = require("../model/Course.model");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOTS = [
  { value: "1", start: "08:00 AM", end: "09:00 AM" },
  { value: "2", start: "09:00 AM", end: "10:00 AM" },
  { value: "3", start: "10:00 AM", end: "11:00 AM" },
  { value: "4", start: "11:00 AM", end: "12:00 PM" },
  { value: "5", start: "12:00 PM", end: "01:00 PM" },
  { value: "6", start: "02:00 PM", end: "03:00 PM" },
];

/**
 * Generate timetable for a specific course and semester.
 */
exports.generateTimetable = async (req, res) => {
  try {
    const { courseId, semester } = req.body;

    if (!courseId || !semester) {
      return res.status(400).json({ success: false, message: "Course and Semester are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }

    // 1. Fetch subjects for this course + semester
    const subjects = await Subject.find({ course: courseId, semester: Number(semester) }).lean();
    if (!subjects.length) {
      return res.status(400).json({ success: false, message: "No subjects found for this course and semester." });
    }

    // 2. Clear existing timetable for this course's specific subjects (essentially this semester's schedule)
    const subjectIds = subjects.map(s => s._id);
    await Timetable.deleteMany({ courseId: courseId, subjectId: { $in: subjectIds } });

    // 3. Prepare resources (Rooms & Teachers)
    const allRooms = await Room.find({}).sort({ capacity: -1 }).lean();
    if (allRooms.length === 0) {
        return res.status(400).json({ success: false, message: "No Rooms found in the database. Please add Rooms first." });
    }

    const allTeacherProfiles = await TeacherProfile.find({}).populate("user").lean();
    if (allTeacherProfiles.length === 0) {
        return res.status(400).json({ success: false, message: "No Teacher Profiles found! The generator requires teachers with assigned subjects. Please create Teacher Profiles." });
    }

    // Mapping of teacher allocations to keep track of their weekly load and daily load
    // so we don't exceed maxLecturesPerWeek, or schedule them on unavailableDays.
    const teacherUsage = {}; 
    allTeacherProfiles.forEach(tp => {
      const userIdStr = (tp.user?._id || tp.user).toString();
      teacherUsage[userIdStr] = {
        profileId: tp._id,
        userId: tp.user?._id || tp.user,
        maxLectures: tp.maxLecturesPerWeek || 20,
        unavailableDays: tp.unavailableDays || [],
        assignedCount: 0,
        // map: Day -> set of slots
        schedule: {
          Monday: new Set(),
          Tuesday: new Set(),
          Wednesday: new Set(),
          Thursday: new Set(),
          Friday: new Set(),
          Saturday: new Set()
        }
      };
    });

    // Room usage to prevent double booking. Since we ONLY cleared timetable for THIS course+sem, 
    // there might be existing bookings for other courses. Let's fetch them.
    const existingTimetables = await Timetable.find({}).lean();
    
    const globalRoomSchedule = {}; // structure: room._id -> Day -> Slot Set
    allRooms.forEach(r => globalRoomSchedule[r._id.toString()] = {
       Monday: new Set(), Tuesday: new Set(), Wednesday: new Set(), Thursday: new Set(), Friday: new Set(), Saturday: new Set()
    });

    const globalTeacherSchedule = {}; // structure: Teacher._id -> Day -> Slot Set
    // Wait, TeacherProfile userId is from RegisterModel. Timetable stores Teacher._id. 
    // We need Teacher collection to reliably map.
    const Teacher = require("../model/Teacher.model");
    const RegisterModel = require("../model/Register.model");
    
    // Build a helper map to go from TeacherProfile -> actual Teacher._id
    const teacherCollection = await Teacher.find({}).lean();
    const emailsToTeacherId = {};
    teacherCollection.forEach(t => emailsToTeacherId[t.email] = t._id);

    for (let tp of allTeacherProfiles) {
       const userId = tp.user?._id || tp.user;
       const regUser = await RegisterModel.findById(userId).lean();
       if (regUser && emailsToTeacherId[regUser.email]) {
           tp.actualTeacherId = emailsToTeacherId[regUser.email];
       }
    }

    // Populate global schedules from DB (existing other courses)
    existingTimetables.forEach(entry => {
       const roomStr = entry.roomId.toString();
       if (globalRoomSchedule[roomStr] && entry.dayOfWeek) {
           globalRoomSchedule[roomStr][entry.dayOfWeek].add(entry.slot);
       }
       const teacherStr = entry.teacherId.toString();
       if (!globalTeacherSchedule[teacherStr]) {
           globalTeacherSchedule[teacherStr] = {
               Monday: new Set(), Tuesday: new Set(), Wednesday: new Set(), Thursday: new Set(), Friday: new Set(), Saturday: new Set()
           };
       }
       if (entry.dayOfWeek) globalTeacherSchedule[teacherStr][entry.dayOfWeek].add(entry.slot);
    });

    // The student group (this specific course+semester combination) cannot have overlapping classes.
    const classSchedule = {
        Monday: new Set(), Tuesday: new Set(), Wednesday: new Set(), Thursday: new Set(), Friday: new Set(), Saturday: new Set()
    };

    const newEntries = [];

    // 4. Algorithm Engine (Greedy approach)
    for (let subject of subjects) {
        let lecturesNeeded = subject.weeklyLectures;

        // Find eligible teachers for this subject
        const eligibleProfiles = allTeacherProfiles.filter(tp => {
             // tp.subjectsCanTeach contains ObjectIds
             if (!tp.actualTeacherId) return false;
             return tp.subjectsCanTeach && tp.subjectsCanTeach.some(sId => sId.toString() === subject._id.toString());
        });

        // Loop to place each lecture
        for (let i = 0; i < lecturesNeeded; i++) {
           let placed = false;
           // Try to find a slot
           for (let day of Object.keys(classSchedule)) {
               if (placed) break;
               for (let slotMeta of SLOTS) {
                   let slot = slotMeta.value;
                   
                   if (placed) break;
                   // If class is already busy doing another subject this slot, skip
                   if (classSchedule[day].has(slot)) continue;

                   // Find an eligible teacher
                   let selectedTeacherId = null;
                   for (let tp of eligibleProfiles) {
                      const teacherStr = tp.actualTeacherId.toString();
                      const stats = teacherUsage[tp.user._id.toString()];
                      
                      // Check constraints for teacher
                      if (stats.unavailableDays.includes(day)) continue;
                      if (stats.assignedCount >= stats.maxLectures) continue;
                      
                      // Check if teacher is free in this slot globally
                      const gts = globalTeacherSchedule[teacherStr];
                      if (gts && gts[day] && gts[day].has(slot)) continue;
                      
                      selectedTeacherId = tp.actualTeacherId;
                      // Optimistically pick the first free teacher
                      break;
                   }

                   if (!selectedTeacherId) continue; // No teacher available for this slot, try next slot

                   // Find an eligible room
                   let selectedRoomId = null;
                   for (let r of allRooms) {
                      // subject type matches room type (theory -> classroom, lab -> lab)
                      if (subject.type && subject.type === "lab" && r.type !== "lab") continue;
                      if (subject.type && subject.type === "theory" && r.type === "lab") continue;

                      const roomStr = r._id.toString();
                      if (globalRoomSchedule[roomStr][day] && !globalRoomSchedule[roomStr][day].has(slot)) {
                         selectedRoomId = r._id;
                         break;
                      }
                   }

                   if (!selectedRoomId) continue; // No room available

                   // Constraints met! PLace it.
                   classSchedule[day].add(slot);
                   globalRoomSchedule[selectedRoomId.toString()][day].add(slot);
                   
                   if (!globalTeacherSchedule[selectedTeacherId.toString()]) {
                       globalTeacherSchedule[selectedTeacherId.toString()] = {
                            Monday: new Set(), Tuesday: new Set(), Wednesday: new Set(), Thursday: new Set(), Friday: new Set(), Saturday: new Set()
                       };
                   }
                   globalTeacherSchedule[selectedTeacherId.toString()][day].add(slot);
                   
                   // find the profile again to incremement usage
                   const prof = eligibleProfiles.find(p => p.actualTeacherId.toString() === selectedTeacherId.toString());
                   if(prof) {
                       const profUserIdStr = (prof.user?._id || prof.user).toString();
                       if (teacherUsage[profUserIdStr]) {
                           teacherUsage[profUserIdStr].assignedCount++;
                       }
                   }

                   newEntries.push({
                       departmentId: course.department,
                       courseId: course._id,
                       subjectId: subject._id,
                       teacherId: selectedTeacherId,
                       roomId: selectedRoomId,
                       dayOfWeek: day,
                       slot: slot,
                       startTime: slotMeta.start,
                       endTime: slotMeta.end
                   });

                   placed = true;
               }
           }
        }
    }

    if (newEntries.length > 0) {
        await Timetable.insertMany(newEntries);
        return res.status(200).json({ 
            success: true, 
            message: "Timetable generated successfully.", 
            generatedCount: newEntries.length 
        });
    } else {
        return res.status(400).json({ 
            success: false, 
            message: "Failed to generate any slots. Ensure teachers are assigned to these subjects and rooms have appropriate capacity/types.", 
            generatedCount: 0 
        });
    }

  } catch (error) {
    console.error("Timetable generation error:", error);
    res.status(500).json({ success: false, message: "Error generating timetable" });
  }
};
