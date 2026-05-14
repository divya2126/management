import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserOutlined, TeamOutlined, BookOutlined, ThunderboltOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    metrics: {
      totalStudents: 0,
      activeTeachers: 0,
      teachersOnLeave: 0,
      totalSubjects: 0,
      totalRooms: 0,
    },
    activity: [],
    workload: []
  });
  
  const [studentData, setStudentData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (user?.role === "student") {
        const res = await axios.get("http://localhost:5001/api/dashboard/student-metrics", { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) setStudentData(res.data);
      } else if (user?.role === "teacher") {
        const res = await axios.get("http://localhost:5001/api/dashboard/teacher-metrics", { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) setTeacherData(res.data);
      } else {
        const res = await axios.get("http://localhost:5001/api/dashboard/metrics", { headers: { Authorization: `Bearer ${token}` }});
        if (res.data.success) setData(res.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    navigate("/timetable");
  };

  // Helper dots for activity
  const getDotColor = (index, type) => {
    if (type === 'leave') return 'bg-yellow-400';
    if (index === 0) return 'bg-blue-500';
    if (index === 2) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-6 animate-fade-in font-sans">
      
      {user?.role === "student" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#1e4a6a] tracking-tight font-sans">Student Dashboard</h1>
              <p className="text-gray-500 text-[15px] mt-1 font-medium">
                Welcome back, {user?.name}. Here's your academic progress.
              </p>
            </div>
          </div>
          {loading ? <div className="p-10 text-center font-bold text-gray-500">Loading your data...</div> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm">
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Overall Grade</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">{studentData?.grade || "N/A"}</h2>
                  <p className="text-gray-400 text-sm">Top 15% of your class</p>
                </div>
                <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm">
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Attendance Percentage</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">{studentData?.attendancePercentage || 0}%</h2>
                  <p className="text-gray-400 text-sm font-semibold mt-4">
                    {studentData?.presentClasses || 0} / {studentData?.totalClasses || 0} Classes Attended
                  </p>
                </div>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm mt-6">
                 <h3 className="text-lg font-bold text-[#1e4a6a] mb-4">Today's Timetable</h3>
                 {studentData?.timetable?.length > 0 ? (
                   <div className="space-y-3">
                     {studentData.timetable.map((t, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div>
                           <div className="font-bold text-[#1e4a6a]">{t.subjectId?.name}</div>
                           <div className="text-xs text-gray-500">{t.teacherId?.name} • Room {t.roomId?.roomNumber}</div>
                         </div>
                         <div className="text-sm font-semibold bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                           {t.startTime} - {t.endTime}
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                     <p className="text-sm text-gray-500 font-medium">No classes scheduled for today! Enjoy your day off.</p>
                   </div>
                 )}
              </div>
            </>
          )}
        </>
      )}

      {user?.role === "teacher" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#1e4a6a] tracking-tight font-sans">Professor Dashboard</h1>
              <p className="text-gray-500 text-[15px] mt-1 font-medium">
                Welcome back, Prof. {user?.name}.
              </p>
            </div>
          </div>
          {loading ? <div className="p-10 text-center font-bold text-gray-500">Loading your schedule...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-bold text-[#1e4a6a] mb-4">Your Workload</h3>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[14px] font-bold text-[#1e4a6a]">Assigned Slots</span>
                  <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                    {teacherData?.workload?.assigned || 0}/{teacherData?.workload?.max || 18}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner mb-4">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${((teacherData?.workload?.assigned || 0) / (teacherData?.workload?.max || 18)) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 font-medium leading-relaxed mt-6">
                  Use the sidebar to request leave, mark attendance, or push notifications to your classes.
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                 <h3 className="text-lg font-bold text-[#1e4a6a] mb-4">Today's Classes</h3>
                 {teacherData?.timetable?.length > 0 ? (
                   <div className="space-y-3">
                     {teacherData.timetable.map((t, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <div>
                           <div className="font-bold text-[#1e4a6a]">{t.subjectId?.name}</div>
                           <div className="text-xs text-gray-500">{t.courseId?.name} • Room {t.roomId?.roomNumber}</div>
                         </div>
                         <div className="text-sm font-semibold bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                           {t.startTime} - {t.endTime}
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-center h-24">
                     <p className="text-sm text-gray-500 font-medium">No classes assigned for you today!</p>
                   </div>
                 )}
              </div>
            </div>
          )}
        </>
      )}

      {(user?.role === "admin" || user?.role === "hod") && (
        <>
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 mb-2">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1e4a6a] tracking-tight font-sans">Dashboard</h1>
          <p className="text-gray-500 text-[15px] mt-1 font-medium">
            Welcome back, {user?.name || "Admin"}. Here's your schedule overview.
          </p>
        </div>
        
        <button 
          onClick={handleGenerate}
          className="mt-4 sm:mt-0 bg-[#1e4a6a] hover:bg-[#153b54] text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5"
        >
          <ThunderboltOutlined className="mr-2 text-cyan-400" />
          Generate Timetable
        </button>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: 2x2 Metrics */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Active Teachers Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase mb-2">Active Teachers</p>
                  <h2 className="text-[36px] font-extrabold text-[#1e4a6a] leading-none mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                    {loading ? "..." : data.metrics.activeTeachers}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">{data.metrics.teachersOnLeave} on leave</p>
                </div>
                <div className="bg-[#81A6C6]/10 p-3.5 rounded-xl text-[#1e4a6a] group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <TeamOutlined className="text-[24px]" />
                </div>
              </div>
              <p className="text-cyan-600 bg-cyan-50 inline-block px-2 py-0.5 rounded text-xs font-bold mt-4">+2 vs last week</p>
            </div>

            {/* Total Subjects Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase mb-2">Total Subjects</p>
                  <h2 className="text-[36px] font-extrabold text-[#1e4a6a] leading-none mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                    {loading ? "..." : data.metrics.totalSubjects}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">6 theory · 2 labs</p>
                </div>
                <div className="bg-[#81A6C6]/10 p-3.5 rounded-xl text-[#1e4a6a] group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <BookOutlined className="text-[24px]" />
                </div>
              </div>
            </div>

            {/* Available Rooms Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase mb-2">Available Rooms</p>
                  <h2 className="text-[36px] font-extrabold text-[#1e4a6a] leading-none mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                    {loading ? "..." : data.metrics.totalRooms}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">1 under maintenance</p>
                </div>
                <div className="bg-[#81A6C6]/10 p-3.5 rounded-xl text-[#1e4a6a] group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <EnvironmentOutlined className="text-[24px]" />
                </div>
              </div>
            </div>

            {/* Total Students Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-[14px] font-semibold tracking-wide uppercase mb-2">Total Students</p>
                  <h2 className="text-[36px] font-extrabold text-[#1e4a6a] leading-none mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                    {loading ? "..." : data.metrics.totalStudents}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">All campuses</p>
                </div>
                <div className="bg-[#81A6C6]/10 p-3.5 rounded-xl text-[#1e4a6a] group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                  <UserOutlined className="text-[24px]" />
                </div>
              </div>
              <p className="text-cyan-600 bg-cyan-50 inline-block px-2 py-0.5 rounded text-xs font-bold mt-4">+5% vs last week</p>
            </div>

          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300">
             <div className="flex justify-between items-center bg-gray-50/80 p-5 rounded-xl border border-gray-100/50">
                <span className="font-bold text-[#1e4a6a] text-[15px] tracking-tight">System Fully Integrated & Active</span>
                <span className="bg-[#1e4a6a] text-white text-[11px] px-3 py-1 font-bold rounded-full shadow-sm tracking-wide uppercase">Live</span>
             </div>
          </div>
          
          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            {/* Bar Chart: Attendance */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300">
              <h3 className="text-[16px] font-extrabold text-[#1e4a6a] mb-6 tracking-tight">7-Day Attendance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts?.attendanceTrends || []}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="percentage" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Pass/Fail Ratio */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 flex flex-col">
              <h3 className="text-[16px] font-extrabold text-[#1e4a6a] mb-2 tracking-tight">Academic Pass/Fail Ratio</h3>
              <div className="h-64 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts?.passFailData || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data.charts?.passFailData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div><span className="text-sm font-medium text-gray-600">Pass</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div><span className="text-sm font-medium text-gray-600">Fail</span></div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Activity & Workload */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <h3 className="text-lg font-extrabold text-[#1e4a6a] mb-6 tracking-tight">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {data.activity.length === 0 && !loading && (
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-sm text-gray-500 font-medium">No recent activity.</p>
                </div>
              )}

              {data.activity.map((act, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-white ${getDotColor(idx, act.type)} absolute left-0 md:left-1/2 -ml-2.5 md:-ml-2.5 shadow-sm z-10 shrink-0`}></div>
                  
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-1">
                    <p className="text-[15px] font-semibold text-[#1e4a6a] leading-snug">{act.sender}: <span className="font-medium text-gray-600">{act.message}</span></p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center font-medium">
                      ⏱ {new Date(act.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Teacher Workload */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mt-6">
            <h3 className="text-lg font-extrabold text-[#1e4a6a] mb-6 tracking-tight">Teacher Workload</h3>
            
            <div className="space-y-5">
              {data.workload.map((teacher, index) => (
                <div key={index}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[14px] font-bold text-[#1e4a6a]">{teacher.name}</span>
                    <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{teacher.assigned}/{teacher.max}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${(teacher.assigned / teacher.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>

      </div>
      </>
      )}
    </div>
  );
}