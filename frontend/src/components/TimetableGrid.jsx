const timetable = {
  Mon: [
    { subject: "Data Structures", code: "CS201", color: "green" },
    { subject: "DBMS", code: "CS301", color: "blue" },
    { subject: "Operating Systems", code: "CS302", color: "purple" },
    { subject: "Machine Learning", code: "CS401", color: "green" },
    "Free",
    { subject: "DS Lab", code: "CS201L", color: "pink" },
    { subject: "DS Lab", code: "CS201L", color: "pink" }
  ],
  Tue: [
    { subject: "Digital Electronics", code: "EC201", color: "yellow" },
    { subject: "Machine Learning", code: "CS401", color: "green" },
    { subject: "Web Development", code: "CS303", color: "orange" },
    "Free",
    { subject: "Data Structures", code: "CS201", color: "green" },
    { subject: "DBMS", code: "CS301", color: "blue" },
    "Free"
  ],
  Wed: [
    { subject: "Operating Systems", code: "CS302", color: "purple" },
    { subject: "Data Structures", code: "CS201", color: "green" },
    "Free",
    { subject: "Web Development", code: "CS303", color: "orange" },
    { subject: "ML Lab", code: "CS401L", color: "pink" },
    { subject: "ML Lab", code: "CS401L", color: "pink" },
    "Free"
  ],
  Thu: [
    { subject: "DBMS", code: "CS301", color: "blue" },
    { subject: "Digital Electronics", code: "EC201", color: "yellow" },
    { subject: "Machine Learning", code: "CS401", color: "green" },
    { subject: "Data Structures", code: "CS201", color: "green" },
    { subject: "Web Development", code: "CS303", color: "orange" },
    "Free",
    "Free"
  ],
  Fri: [
    { subject: "Operating Systems", code: "CS302", color: "purple" },
    "Free",
    { subject: "Digital Electronics", code: "EC201", color: "yellow" },
    { subject: "DBMS", code: "CS301", color: "blue" },
    { subject: "DS Lab", code: "CS201L", color: "pink" },
    { subject: "DS Lab", code: "CS201L", color: "pink" },
    "Free"
  ]
};

const colorMap = {
  green: "bg-green-50 border-green-500 text-green-700",
  blue: "bg-blue-50 border-blue-500 text-blue-700",
  purple: "bg-purple-50 border-purple-500 text-purple-700",
  yellow: "bg-yellow-50 border-yellow-500 text-yellow-700",
  orange: "bg-orange-50 border-orange-500 text-orange-700",
  pink: "bg-pink-50 border-pink-500 text-pink-700"
};

const timeSlots = [
  "9:00-9:50",
  "9:50-10:40",
  "10:50-11:40",
  "11:40-12:30",
  "1:30-2:20",
  "2:20-3:10",
  "3:10-4:00"
];

const TimetableGrid = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Today's Schedule (CS-A)
      </h2>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-3 min-w-[900px]">

          {/* Header row */}
          <div className="font-semibold text-gray-600">Day / Period</div>
          {timeSlots.map(time => (
            <div key={time} className="text-sm font-semibold text-gray-600">
              {time}
            </div>
          ))}

          {/* Rows */}
          {Object.entries(timetable).map(([day, slots]) => (
            <>
              <div className="font-semibold text-gray-700">{day}</div>

              {slots.map((slot, index) =>
                slot === "Free" ? (
                  <div
                    key={index}
                    className="border border-dashed rounded-lg flex items-center justify-center text-gray-400 text-sm"
                  >
                    Free
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`border-l-4 rounded-lg p-3 text-sm ${colorMap[slot.color]}`}
                  >
                    <p className="font-semibold">{slot.subject}</p>
                    <p className="text-xs">{slot.code}</p>
                  </div>
                )
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;
