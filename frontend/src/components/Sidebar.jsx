import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`
        ${open ? "w-64" : "w-20"}
        h-full
        bg-green-600
        text-white
        transition-all
        duration-300
        flex
        flex-col
        overflow-y-auto
      `}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4">
        {open && <h1 className="text-large font-bold">Edu care</h1>}

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl focus:outline-none bg-red-500
"
        >
          ☰
        </button>
      </div>
      
      {/* Menu */}
      <nav className="flex flex-col gap-3 px-3 mt-6">
        <SidebarItem icon="🏠" label="Dashboard" open={open} />
        <SidebarItem icon="📅" label="Timetable" open={open} />
        <SidebarItem icon="👩‍🏫" label="Teachers" open={open} />
        <SidebarItem icon="🎓" label="Students" open={open} />
        <SidebarItem icon="📘" label="Subjects" open={open} />
      </nav>

      {/* Bottom */}
      <div className="mt-auto p-4">
        <SidebarItem icon="⚙️" label="Settings" open={open} />
      </div>
    </div>
  );
};
const SidebarItem = ({ icon, label, open }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-500 cursor-pointer">
      <span className="text-xl">{icon}</span>
      {open && <span className="text-sm">{label}</span>}
    </div>
  );
};

export default Sidebar;
