import { useAuth } from "../context/AuthContext";
import { UserOutlined, TeamOutlined, AppstoreOutlined, LineChartOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const attendanceData = [
  { name: "Mon", attendance: 92 },
  { name: "Tue", attendance: 88 },
  { name: "Wed", attendance: 95 },
  { name: "Thu", attendance: 90 },
  { name: "Fri", attendance: 85 },
  { name: "Sat", attendance: 75 },
  { name: "Sun", attendance: 0 },
];

const gradeData = [
  { name: "A Grade", value: 40 },
  { name: "B Grade", value: 35 },
  { name: "C Grade", value: 15 },
  { name: "F Grade", value: 10 },
];

// Replaced generic colors with the exact Home Page Theme Palette: Deep Blue, Bright Blue, Teal, Emerald
const COLORS = ["#1e3a8a", "#2563eb", "#14b8a6", "#10b981"];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-teal-600">{user?.name || "User"}</span>! Here's what's happening.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Deep Blue Border */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 border border-gray-100 border-l-4 border-l-[#1e3a8a] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#1e3a8a] opacity-5 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Total Students</p>
            <UserOutlined className="text-[#1e3a8a] text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">1,250</h2>
          <p className="text-xs text-green-500 mt-2 font-medium">↑ 5% from last month</p>
        </div>

        {/* Vibrant Blue Border */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 border border-gray-100 border-l-4 border-l-[#2563eb] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#2563eb] opacity-5 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Teachers</p>
            <TeamOutlined className="text-[#2563eb] text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">45</h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Active faculty members</p>
        </div>

        {/* Teal Border */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 border border-gray-100 border-l-4 border-l-[#14b8a6] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#14b8a6] opacity-5 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Classes</p>
            <AppstoreOutlined className="text-[#14b8a6] text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">32</h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Active courses scheduled</p>
        </div>

        {/* Emerald Border */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 border border-gray-100 border-l-4 border-l-[#10b981] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#10b981] opacity-5 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Attendance Rate</p>
            <LineChartOutlined className="text-[#10b981] text-xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">92.5%</h2>
          <p className="text-xs text-green-500 mt-2 font-medium">↑ 1.2% this week</p>
        </div>
      </div>

      {/* CHARTS LAYER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Trends Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden md:block group">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Attendance Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} dx={-10} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: "#1e3a8a" }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden md:block">
          <h3 className="text-lg font-bold mb-6 text-gray-800">Grade Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#4b5563', fontWeight: 500 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}