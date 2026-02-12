const ScheduleTable = () => {
  return (
    <div className="bg-white rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">
        📅 Today's Schedule (CS-A)
      </h2>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3">Monday</th>
            <th className="p-3">Tuesday</th>
            <th className="p-3">Wednesday</th>
            <th className="p-3">Thursday</th>
            <th className="p-3">Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">9:00</td>
            <td className="p-3 bg-indigo-100 rounded">Math</td>
            <td className="p-3"></td>
            <td className="p-3"></td>
            <td className="p-3"></td>
            <td className="p-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
