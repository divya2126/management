import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { UserOutlined, TeamOutlined, BookOutlined, ThunderboltOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";

export default function Dashboard() {
  const { user } = useAuth();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/dashboard/metrics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    message.success("AI Timetable Generation will start soon!");
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
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
        <div>
          <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight font-sans">Dashboard</h1>
          <p className="text-gray-500 text-[15px] mt-1">
            Welcome back, {user?.name || "Admin"}. Here's your schedule overview.
          </p>
        </div>
        
        <button 
          onClick={handleGenerate}
          className="mt-4 sm:mt-0 bg-[#2C9F8D] hover:bg-[#238071] text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-all duration-200 shadow-sm"
        >
          <ThunderboltOutlined className="mr-2" />
          Generate Timetable
        </button>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: 2x2 Metrics */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Active Teachers Card */}
            <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Active Teachers</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">
                    {loading ? "..." : data.metrics.activeTeachers}
                  </h2>
                  <p className="text-gray-400 text-sm">{data.metrics.teachersOnLeave} on leave</p>
                </div>
                <div className="bg-[#f0fdfa] p-3 rounded-lg text-[#0d9488]">
                  <TeamOutlined className="text-[22px]" />
                </div>
              </div>
              <p className="text-[#10b981] text-xs font-semibold mt-4">+2 vs last week</p>
            </div>

            {/* Total Subjects Card */}
            <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Total Subjects</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">
                    {loading ? "..." : data.metrics.totalSubjects}
                  </h2>
                  <p className="text-gray-400 text-sm">6 theory · 2 labs</p>
                </div>
                <div className="bg-[#f0fdfa] p-3 rounded-lg text-[#0d9488]">
                  <BookOutlined className="text-[22px]" />
                </div>
              </div>
            </div>

            {/* Available Rooms Card */}
            <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Available Rooms</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">
                    {loading ? "..." : data.metrics.totalRooms}
                  </h2>
                  <p className="text-gray-400 text-sm">1 under maintenance</p>
                </div>
                <div className="bg-[#f0fdfa] p-3 rounded-lg text-[#0d9488]">
                  <EnvironmentOutlined className="text-[22px]" />
                </div>
              </div>
            </div>

            {/* Total Students Card (Replaced Conflicts) */}
            <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#64748b] text-[15px] font-medium mb-2">Total Students</p>
                  <h2 className="text-[32px] font-bold text-[#0f172a] leading-none mb-2">
                    {loading ? "..." : data.metrics.totalStudents}
                  </h2>
                  <p className="text-gray-400 text-sm">All campuses</p>
                </div>
                <div className="bg-[#f0fdfa] p-3 rounded-lg text-[#0d9488]">
                  <UserOutlined className="text-[22px]" />
                </div>
              </div>
              <p className="text-[#10b981] text-xs font-semibold mt-4">+5% vs last week</p>
            </div>

          </div>
          
          {/* Below cards: Timetable placeholders */}
          <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-800 text-lg">CSE — Sem 5, Section A</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 font-medium rounded-full">v2.1 · Finalized</span>
             </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Activity & Workload */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1e293b] mb-6">Recent Activity</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              {data.activity.length === 0 && !loading && (
                <p className="text-sm text-gray-500 pl-4">No recent activity.</p>
              )}

              {data.activity.map((act, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-white ${getDotColor(idx, act.type)} absolute left-0 md:left-1/2 -ml-2.5 md:-ml-2.5 shadow z-10 shrink-0`}></div>
                  
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] ml-8 md:ml-0 p-1">
                    <p className="text-[15px] text-gray-800 leading-snug">{act.sender}: {act.message}</p>
                    <div className="text-xs text-gray-400 mt-1 flex items-center">
                      ⏱ {new Date(act.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}

              {/* Static Backup if no DB hits yet just to show UI */}
              {data.activity.length === 0 && (
                 <>
                   <div className="relative flex items-center group">
                      <div className="flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 absolute left-1 shadow z-10 shrink-0 mt-1 top-0"></div>
                      <div className="ml-8 pb-4">
                        <p className="text-[14px] text-gray-800 leading-snug">Timetable v2.1 published for CSE Sem 5</p>
                        <p className="text-[12px] text-gray-400 mt-1">2 hours ago</p>
                      </div>
                   </div>
                   <div className="relative flex items-center group">
                      <div className="flex items-center justify-center w-3 h-3 rounded-full bg-yellow-400 absolute left-1 shadow z-10 shrink-0 mt-1 top-0"></div>
                      <div className="ml-8 pb-4">
                        <p className="text-[14px] text-gray-800 leading-snug">Prof. Suresh Patel applied for leave</p>
                        <p className="text-[12px] text-gray-400 mt-1">3 hours ago</p>
                      </div>
                   </div>
                 </>
              )}

            </div>
          </div>

          {/* Teacher Workload */}
          <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1e293b] mb-6">Teacher Workload</h3>
            
            <div className="space-y-5">
              {data.workload.map((teacher, index) => (
                <div key={index}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[15px] font-medium text-gray-700">{teacher.name}</span>
                    <span className="text-xs text-gray-500 font-medium">{teacher.assigned}/{teacher.max}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#2C9F8D] h-1.5 rounded-full" 
                      style={{ width: `${(teacher.assigned / teacher.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}