const { GoogleGenerativeAI } = require("@google/generative-ai");
const Student = require("../model/Student.model");
const Teacher = require("../model/Teacher.model");
const Attendance = require("../model/Attendance.model");
const Timetable = require("../model/Timetable.model");
const Department = require("../model/Department.model");

// Initialize Gemini API (done per-request to always use latest key)

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const email = req.user.email;
    const role = req.user.role;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ success: false, message: "GEMINI_API_KEY not configured in backend .env file." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    let userContext = "";

    // 1. Fetch Live Context based on Role
    if (role === "student") {
      const student = await Student.findOne({ email });
      if (student) {
        // Get Attendance
        const attendances = await Attendance.find({ "records.studentId": student._id });
        let total = 0, present = 0;
        attendances.forEach(att => {
          const rec = att.records.find(r => r.studentId.toString() === student._id.toString());
          if (rec) { total++; if (rec.status === "Present") present++; }
        });
        const attPct = total === 0 ? 100 : Math.round((present / total) * 100);

        // Get Timetable for today
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = days[new Date().getDay()];
        let classes = [];
        if (student.department) {
          const dept = await Department.findOne({ name: student.department });
          if (dept) {
            const tt = await Timetable.find({ departmentId: dept._id, dayOfWeek: today }).populate("subjectId", "name").populate("roomId", "roomNumber").populate("teacherId", "name").lean();
            classes = tt.map(t => `${t.subjectId?.name} at ${t.startTime}-${t.endTime} in Room ${t.roomId?.roomNumber} with Prof. ${t.teacherId?.name}`);
          }
        }

        userContext = `User Role: Student\nName: ${student.name}\nDepartment: ${student.department || 'N/A'}\nOverall Attendance: ${attPct}%\nToday's Schedule: ${classes.length > 0 ? classes.join(" | ") : "No classes today"}.`;
      }
    } else if (role === "teacher" || role === "hod") {
      const teacher = await Teacher.findOne({ email });
      if (teacher) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = days[new Date().getDay()];
        const tt = await Timetable.find({ teacherId: teacher._id, dayOfWeek: today }).populate("subjectId", "name").populate("roomId", "roomNumber").lean();
        const classes = tt.map(t => `${t.subjectId?.name} at ${t.startTime}-${t.endTime} in Room ${t.roomId?.roomNumber}`);

        userContext = `User Role: Professor/HOD\nName: Prof. ${teacher.name}\nDepartment: ${teacher.department || 'N/A'}\nToday's Classes to teach: ${classes.length > 0 ? classes.join(" | ") : "No classes assigned to teach today"}.`;
      }
    } else {
      userContext = `User Role: Admin. Has full access to the system.`;
    }

    // 2. Construct Prompt
    const systemPrompt = `You are "Schedulify AI", the official advanced academic assistant for this university ERP system. 
You are extremely helpful, professional, concise, and friendly.
Here is the LIVE, real-time database context for the user you are talking to:
---
${userContext}
---
IMPORTANT RULES:
1. ONLY answer based on the context provided above if they ask about their personal data (attendance, timetable, classes, etc.).
2. If they ask a general question, give a helpful generic answer.
3. Keep your answers short (1-3 sentences max) and format them beautifully using markdown (e.g. bolding key numbers, times, and class names).
4. Do NOT say "according to the database" or "based on the context". Just speak naturally.
5. If they ask about something not in the context (like "what are my exam grades"), say "I don't have access to that information right now, but I can check your timetable or attendance!"
`;

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", // Changed from 1.5-flash to 1.5-pro due to 404
      systemInstruction: systemPrompt 
    });
    
    const result = await model.generateContent(message);

    const aiResponse = result.response.text();

    res.json({ success: true, reply: aiResponse });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ success: false, message: "AI Engine Error: " + error.message });
  }
};
