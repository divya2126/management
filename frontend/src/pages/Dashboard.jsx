import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import TimetableGrid from "../components/TimetableGrid";

const Dashboard = () => {
  return (
    <div className="flex h-full bg-black-100 justify-center ">
      <Sidebar />

      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <Navbar />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <StatCard title="Total Teachers" value="5" color="bg-indigo-100" />
          <StatCard title="Total Students" value="250" color="bg-teal-100" />
          <StatCard title="Active Subjects" value="7" color="bg-green-100" />
          <StatCard title="Class Sections" value="4" color="bg-yellow-100" />
        </div>
      

        <TimetableGrid />
      </div>
    </div>
  );
};

export default Dashboard;

