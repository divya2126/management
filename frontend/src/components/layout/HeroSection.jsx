import { CalendarDays, Users, BookOpen, Clock } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center text-white pt-20 bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#14b8a6]">

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative container mx-auto px-6">

        {/* TOP CONTENT */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
            Smart Scheduling for Colleges
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
            College Timetable <br />
            <span className="text-teal-300">Management</span>
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Effortlessly create, manage, and share college timetables.
            Streamline scheduling for departments, faculty, and students.
          </p>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="bg-teal-400 px-6 py-3 rounded-xl font-semibold">
              Get Started
            </button>

            <button className="border border-white px-6 py-3 rounded-xl font-semibold">
              View Demo
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          {[
            { icon: <CalendarDays />, title: "5,000+", sub: "Schedules" },
            { icon: <Users />, title: "1,200+", sub: "Users" },
            { icon: <BookOpen />, title: "50+", sub: "Departments" },
            { icon: <Clock />, title: "10,000+", sub: "Hours Saved" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-sm text-gray-200">{item.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;