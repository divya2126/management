const StatCard = ({ title, value, color }) => {
  return (
    <div className={`p-6 rounded-xl ${color}`}>
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
