import React from 'react'

const Navbar = () => {
   return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <input
          className="border rounded-md px-3 py-1"
          placeholder="Search..."
        />
        🔔
        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
          AD
        </div>
      </div>
    </div>
  );
}

export default Navbar