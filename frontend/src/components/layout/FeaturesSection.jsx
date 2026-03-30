import { CalendarClock, Network, BellRing, ShieldCheck, Smartphone, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Auto Scheduling",
      desc: "Generate conflict-free timetables automatically with smart algorithms.",
      icon: <CalendarClock className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-100",
    },
    {
      title: "Multi-Department",
      desc: "Manage schedules across multiple departments and semesters seamlessly.",
      icon: <Network className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-100",
    },
    {
      title: "Instant Notifications",
      desc: "Get alerts for schedule changes, room swaps, and cancellations.",
      icon: <BellRing className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-100",
    },
    {
      title: "Role-Based Access",
      desc: "Admins, faculty, and students each get tailored views and permissions.",
      icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
      color: "bg-rose-100",
    },
    {
      title: "Mobile Friendly",
      desc: "Access your timetable on any device — phone, tablet, or desktop.",
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Analytics",
      desc: "Track room utilization, faculty workload, and scheduling efficiency.",
      icon: <BarChart3 className="w-6 h-6 text-fuchsia-600" />,
      color: "bg-fuchsia-100",
    },
  ];

  return (
    <section id="features" className="bg-gradient-to-b from-gray-50 to-gray-100 py-24 px-6 overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply blur-3xl opacity-50 md:opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-50 md:opacity-30"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply blur-3xl opacity-50 md:opacity-30"></div>

      <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Heading */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-2 rounded-full bg-teal-50 border border-teal-200 shadow-sm">
          <p className="text-teal-700 text-sm tracking-widest font-semibold uppercase">
            Features
          </p>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 tracking-tight">
          Everything You Need to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
            Manage Schedules
          </span>
        </h2>

        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
          Powerful tools designed specifically for college workflows, automating the complex task of timetable generation so you can focus on education.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl text-left shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-start"
            >
              <div className={`w-14 h-14 ${item.color} flex items-center justify-center rounded-2xl mb-6 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ease-out ring-4 ring-white`}>
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">
                {item.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;