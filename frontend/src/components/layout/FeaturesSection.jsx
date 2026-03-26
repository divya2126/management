const FeaturesSection = () => {
  const features = [
    {
      title: "Auto Scheduling",
      desc: "Generate conflict-free timetables automatically with smart algorithms.",
    },
    {
      title: "Multi-Department",
      desc: "Manage schedules across multiple departments and semesters seamlessly.",
    },
    {
      title: "Instant Notifications",
      desc: "Get alerts for schedule changes, room swaps, and cancellations.",
    },
    {
      title: "Role-Based Access",
      desc: "Admins, faculty, and students each get tailored views and permissions.",
    },
    {
      title: "Mobile Friendly",
      desc: "Access your timetable on any device — phone, tablet, or desktop.",
    },
    {
      title: "Analytics",
      desc: "Track room utilization, faculty workload, and scheduling efficiency.",
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-6">

        {/* Heading */}
        <p className="text-teal-500 tracking-widest font-medium">
          FEATURES
        </p>

        <h2 className="text-4xl font-bold mt-4 text-gray-900">
          Everything You Need to Manage Schedules
        </h2>

        <p className="text-gray-500 mt-3">
          Powerful tools designed specifically for college scheduling workflows.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition"
            >
              {/* Icon placeholder (you can add lucide icons here later) */}
              <div className="w-12 h-12 bg-teal-100 text-teal-600 flex items-center justify-center rounded-lg mb-4">
                ✓
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="text-gray-500 mt-2">
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