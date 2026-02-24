import { Table, Tag, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    fixed: "left",
    width: 120,
  },
  {
    title: "Monday",
    dataIndex: "monday",
  },
  {
    title: "Tuesday",
    dataIndex: "tuesday",
  },
  {
    title: "Wednesday",
    dataIndex: "wednesday",
  },
  {
    title: "Thursday",
    dataIndex: "thursday",
  },
  {
    title: "Friday",
    dataIndex: "friday",
  },
];

const data = [
  {
    key: 1,
    time: "9:00 - 10:00",
    monday: <Tag color="blue">Math (Room 101)</Tag>,
    tuesday: <Tag color="green">Physics (Room 202)</Tag>,
    wednesday: <Tag color="purple">CS (Lab 1)</Tag>,
    thursday: <Tag color="orange">English</Tag>,
    friday: <Tag color="cyan">Chemistry</Tag>,
  },
  {
    key: 2,
    time: "10:00 - 11:00",
    monday: <Tag color="purple">CS (Lab 1)</Tag>,
    tuesday: <Tag color="blue">Math</Tag>,
    wednesday: <Tag color="green">Physics</Tag>,
    thursday: <Tag color="cyan">Chemistry</Tag>,
    friday: <Tag color="orange">English</Tag>,
  },
  {
    key: 3,
    time: "11:00 - 12:00",
    monday: <Tag color="orange">English</Tag>,
    tuesday: <Tag color="cyan">Chemistry</Tag>,
    wednesday: <Tag color="blue">Math</Tag>,
    thursday: <Tag color="purple">CS Lab</Tag>,
    friday: <Tag color="green">Physics</Tag>,
  },
];

export default function Timetable() {
  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-2">Timetable</h1>
      <p className="text-gray-500 mb-6">
        Manage weekly class schedules.
      </p>

      {/* BUTTON */}
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />}>
          Add Schedule
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
}